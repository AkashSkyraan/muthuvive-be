import axios from "axios";
import {
  addUpdateAminities,
  getAmenities,
  getPropertyHighlights,
  PincodeDB,
  PincodeResult,
} from "../types/src.types";
import { executeQuery, safeJSONParse } from "../utils/helper";

export class SourceModel {
  static async insertMultipleMedia(files: any[]) {
    if (!files?.length) {
      return [];
    }

    const values: any[] = [];
    const placeholders: string[] = [];

    files.forEach((file) => {
      placeholders.push("(?, ?, ?, ?, ?, ?, ?)");

      values.push(
        file.file_name,
        file.org_name,
        file.url,
        file.path,
        file.mime_type,
        file.media_type,
        file.file_size,
      );
    });

    const query = `
    INSERT INTO media (
      file_name,
      org_name,
      url,
      path,
      mime_type,
      media_type,
      file_size
    )
    VALUES ${placeholders.join(", ")}
  `;

    const result: any = await executeQuery(query, values);

    const insertedIds = [];

    for (let i = 0; i < result.affectedRows; i++) {
      insertedIds.push(result.insertId + i);
    }

    return insertedIds;
  }

  static async getUploads(params: {
    media_type?: string;
    id?: string | number | number[];
  }) {
    const { media_type, id } = params;

    const conditions: string[] = ["status = 'active'"];
    const queryParams: any[] = [];

    if (media_type) {
      const types = media_type.split(",").map((t) => t.trim());

      if (types.length) {
        conditions.push(`media_type IN (${types.map(() => "?").join(",")})`);
        queryParams.push(...types);
      }
    }

    if (id) {
      let ids: any[] = [];

      if (Array.isArray(id)) {
        ids = id;
      } else {
        ids = String(id)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      }

      if (ids.length) {
        conditions.push(`id IN (${ids.map(() => "?").join(",")})`);
        queryParams.push(...ids);
      }
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const dataQuery = `
    SELECT
      id,
      file_name,
      org_name,
      url,
      file_size,
    COALESCE(created_at, '') AS created_at
    FROM media
    ${whereClause}
    ORDER BY id DESC
    
  `;

    const rows: any = await executeQuery(dataQuery, [...queryParams]);

    return {
      data: rows || [],
    };
  }

  // aminities

  static async addUpdateAminities(data: addUpdateAminities) {
    console.log(data);
    if (data.id) {
      const sql = `
        UPDATE amenities
        SET
          name = ?,
          status = ?
        WHERE id = ?
      `;

      await executeQuery(sql, [data.name, data.status, data.id]);

      return {
        id: data.id,
      };
    }

    const sql = `
      INSERT INTO amenities (
       name 
      )
      VALUES (?)
    `;

    const result: any = await executeQuery(sql, [data.name]);

    return {
      id: result.insertId,
    };
  }

  static async getAmenities(data: getAmenities = {}) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }

    if (data.status !== undefined) {
      conditions.push("status = ?");
      values.push(data.status === "active" ? 1 : 0);
    }

    let sql = `
    SELECT 
      id,
      name,
      status,
      created_at
    FROM amenities
  `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY id DESC`;

    const rows: any = await executeQuery(sql, values);

    if (data.id) {
      return rows.length > 0 ? rows[0] : null;
    }

    return rows || [];
  }

  // property highlights

  static async addUpdatePropertyHighlights(data: any) {
    if (data.id) {
      const sql = `
      UPDATE prop_highlights
      SET
        name = ?,
        status = ?
      WHERE id = ?
    `;

      const values = [data.name, data.status, data.id];

      await executeQuery(sql, values);

      return {
        id: data.id,
      };
    }

    const sql = `
    INSERT INTO prop_highlights (
      name,
      status
    )
    VALUES (?, ?)
  `;

    const result: any = await executeQuery(sql, [data.name, data.status]);

    return {
      id: result.insertId,
    };
  }

  static async getPropertyHighlights(data: getPropertyHighlights = {}) {
    const conditions: string[] = [];
    const values: any[] = [];
    if (data.id) {
      conditions.push("id = ?");
      values.push(data.id);
    }
    if (data.status !== undefined) {
      conditions.push("status = ?");
      values.push(data.status);
    }
    let sql = ` SELECT id, name, status, created_at FROM prop_highlights `;
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }
    sql += ` ORDER BY id DESC`;
    const rows: any = await executeQuery(sql, values);
    if (data.id) {
      return rows.length > 0 ? rows[0] : null;
    }
    return rows || [];
  }

  static async getLatLngFromPincode(
    pincode: string,
    icountry: string,
  ): Promise<PincodeResult | null> {
    try {
      const normalize = (val: string) => val?.trim().toLowerCase();
      const rows: PincodeDB[] = await executeQuery(
        `SELECT * FROM pincode_details_from_pincode WHERE pincode = ?`,
        [pincode],
      );

      if (rows.length > 0) {
        const r = rows[0];

        if (r.country?.trim().toLowerCase() !== normalize(icountry)) {
          return null;
        }
        return {
          pincode: r.pincode,
          postcode_localities: safeJSONParse(r.postcode_localities),
          city: r.city ? r.city : r.state ? r.state : "",
          district: r.district ? r.district : r.state ? r.state : "",
          state: r.state ?? "",
          country: r.country ?? "",
          lat: r.lat ?? 0,
          lng: r.lng ?? 0,
          formatted_address: r.formatted_address ?? "",
        };
      }

      const resp = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: `${pincode}`,
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        },
      );

      if (resp.data.status !== "OK" || !resp.data.results?.length) {
        return null;
      }

      const result = resp.data.results[0];

      const geometry = result.geometry?.location;
      if (!geometry) return null;

      let city = "";
      let district = "";
      let state = "";
      let country = "";

      (result.address_components || []).forEach((c: any) => {
        if (c.types.includes("locality") || c.types.includes("postal_town"))
          city = c.long_name;
        if (c.types.includes("administrative_area_level_3"))
          district = c.long_name;
        if (c.types.includes("administrative_area_level_1"))
          state = c.long_name;
        if (c.types.includes("country")) country = c.long_name;
      });

      if (country.trim().toLowerCase() !== icountry.trim().toLowerCase())
        return null;

      if (!city) {
        city = state;
      }

      if (!district) {
        district = state;
      }

      const postcode_localities: string[] = result.postcode_localities || [];
      const formattedAddress = result.formatted_address || "";

      await executeQuery(
        `INSERT INTO pincode_details_from_pincode
         (pincode, postcode_localities, city, district, state, country, lat, lng, formatted_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pincode,
          JSON.stringify(postcode_localities),
          city ? city : state,
          district ? district : state,
          state,
          country,
          geometry.lat,
          geometry.lng,
          formattedAddress,
        ],
      );

      return {
        pincode,
        postcode_localities,
        city,
        district,
        state,
        country,
        lat: geometry.lat,
        lng: geometry.lng,
        formatted_address: formattedAddress,
      };
    } catch (err) {
      console.error("getLatLngFromPincode error:", err);
      return null;
    }
  }

  static async getPincodeDetails(
    country: string,
    state?: string,
    district?: string,
    city?: string,
  ) {
    try {
      if (!state && !district) {
        return await executeQuery(
          `
        SELECT DISTINCT
          state
        FROM pincodes
        WHERE country = ?
          AND state IS NOT NULL
          AND TRIM(state) != ''
        ORDER BY state ASC
        `,
          [country],
        );
      }

      if (state && !district) {
        return await executeQuery(
          `
        SELECT DISTINCT
          district
        FROM pincodes
        WHERE country = ?
          AND state LIKE ?
          AND district IS NOT NULL
          AND TRIM(district) != ''
        ORDER BY district ASC
        `,
          [country, `%${state}%`],
        );
      }

      if (state && district) {
        return await executeQuery(
          `
        SELECT DISTINCT
          post AS city
        FROM pincodes
        WHERE country = ?
          AND state LIKE ?
          AND district LIKE ?
          AND post IS NOT NULL
          AND TRIM(post) != ''
        ORDER BY post ASC
        `,
          [country, `%${state}%`, `%${district}%`],
        );
      }

      if (state && district && city) {
        return await executeQuery(
          `
        SELECT DISTINCT
          post AS city
        FROM pincodes
        WHERE country = ?
          AND state LIKE ?
          AND district LIKE ?
          AND post LIKE ?
          AND post IS NOT NULL
          AND TRIM(post) != ''
        ORDER BY post ASC
        `,
          [country, `%${state}%`, `%${district}%`, `%${city}%`],
        );
      }

      return [];
    } catch (error) {
      console.error("getPincodeDetails model error:", error);
      throw error;
    }
  }
}

import { customAlphabet } from "nanoid";
import { executeQuery } from "../utils/helper";

const generatePropertyId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  5,
);
export class FormModule {
  static async savePropertyStep(data: any) {
    switch (data.step) {
      case 1:
        return await this.createPropertyStep1(data);
      case 2:
        return await this.updatePropertyStep2(data);
      case 3:
        return await this.updatePropertyStep3(data);
      case 4:
        return await this.updatePropertyStep4(data);

      default:
        throw new Error("Invalid property step");
    }
  }
  static async createPropertyStep1(data: any) {
    const { category, sub_category, country, state, district, city, map_link } =
      data.body;

    const user_id = data.user_id;
    const prop_id = data.prop_id;

    if (prop_id) {
      const result: any = await executeQuery(
        `
        UPDATE prop_form
        SET
          category = ?,
          sub_category = ?,
          country = ?,
          state = ?,
          district = ?,
          city = ?,
          map = ?,
          step = GREATEST(step, 1)
        WHERE prop_id = ?
          AND user_id = ?
        `,
        [
          category,
          sub_category,
          country,
          state,
          district,
          city,
          map_link,
          prop_id,
          user_id,
        ],
      );

      if (result.affectedRows === 0) {
        throw new Error("Property not found");
      }

      return {
        prop_id,
        step: 1,
        action: "updated",
      };
    }

    const ms = Date.now().toString().slice(-3);
    const newPropId = `P${generatePropertyId()}${ms}`;

    const result: any = await executeQuery(
      `
      INSERT INTO prop_form (
        prop_id,
        category,
        sub_category,
        country,
        state,
        district,
        city,
        user_id,
        map,
        step,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active')
      `,
      [
        newPropId,
        category,
        sub_category,
        country,
        state,
        district,
        city,
        user_id,
        map_link,
      ],
    );

    return {
      prop_id: newPropId,
      id: result.insertId,
      step: 1,
      action: "created",
    };
  }

  static async updatePropertyStep2(data: any) {
    const { body, user_id, prop_id } = data;

    const {
      prop_name,
      prop_area,
      area_unit,
      road_plan,
      road_length,
      road_length_unit,
      pathway,
      length,
      length_unit,
      width,
      width_unit,
      c_well,
      i_well,
      electricity,
      hp,
      facing,
      construct,
      construct_type,
      other_type,
      min_price,
      max_price,
      carpet_area,
      carp_unit,
      build,
      build_unit,
      super_build,
      super_build_unit,
      total_floor,
      your_floor,
      avail_status,
      bhk,
    } = body;

    const result: any = await executeQuery(
      `
    UPDATE prop_form
    SET
      prop_name = ?,
      prop_area = ?,
      area_unit = ?,
      road_plan = ?,
      road_length = ?,
      road_length_unit = ?,
      path_way = ?,
      length = ?,
      length_unit = ?,
      width = ?,
      width_unit = ?,
      c_well = ?,
      i_well = ?,
      electricity = ?,
      hp = ?,
      facing = ?,
      construct = ?,
      construct_type = ?,
      other_type = ?,
      min_price = ?,
      max_price = ?,
       carpet_area = ?,
      carp_unit = ?,
      build = ?,
      build_unit = ?,
      super_build = ?,
      super_build_unit = ?,
      total_floor = ?,
      your_floor = ?,
      avail_status = ?,
      bhk = ?,
     step = GREATEST(step, 2)
    WHERE prop_id = ?
      AND user_id = ?
    `,
      [
        prop_name ?? null,
        prop_area ?? null,
        area_unit ?? null,
        road_plan ?? null,
        road_length ?? null,
        road_length_unit ?? null,
        pathway ?? null,
        length ?? null,
        length_unit ?? null,
        width ?? null,
        width_unit ?? null,
        c_well ?? null,
        i_well ?? null,
        electricity ?? 0,
        hp ?? null,
        facing ?? null,
        construct ?? 0,
        construct_type ?? null,
        other_type ?? null,
        min_price ?? null,
        max_price ?? null,
        carpet_area ?? null,
        carp_unit ?? null,
        build ?? null,
        build_unit ?? null,
        super_build ?? null,
        super_build_unit ?? null,
        total_floor ?? null,
        your_floor ?? null,
        avail_status ?? null,
        bhk ?? null,
        prop_id ?? null,
        user_id ?? null,
      ],
    );

    if (result.affectedRows === 0) {
      throw new Error("Property not found");
    }

    return {
      prop_id,
      step: 2,
      action: "updated",
    };
  }

  static async updatePropertyStep3(data: any) {
    const { body, user_id, prop_id } = data;

    const { amenities = [], prop_highs = [], rooms, lift, washroom } = body;

    const property: any = await executeQuery(
      `
    SELECT id
    FROM prop_form
    WHERE prop_id = ?
      AND user_id = ?
    LIMIT 1
    `,
      [prop_id, user_id],
    );

    if (!property.length) {
      throw new Error("Property not found");
    }

    await executeQuery(
      `
    DELETE FROM prop_amenities
    WHERE prop_id = ?
    `,
      [prop_id],
    );

    if (amenities.length > 0) {
      const amenityValues = amenities.map((amenity_id: number) => [
        prop_id,
        amenity_id,
      ]);

      await executeQuery(
        `
      INSERT INTO prop_amenities (
        prop_id,
        amenity_id
      )
      VALUES ?
      `,
        [amenityValues],
      );
    }

    await executeQuery(
      `
    DELETE FROM prop_highs
    WHERE prop_id = ?
    `,
      [prop_id],
    );

    if (prop_highs.length > 0) {
      const highValues = prop_highs.map((high_id: number) => [
        prop_id,
        high_id,
      ]);

      await executeQuery(
        `
      INSERT INTO prop_highs (
        prop_id,
        high_id
      )
      VALUES ?
      `,
        [highValues],
      );
    }

    await executeQuery(
      `
    UPDATE prop_form
    SET rooms = ?,
    lift = ?,
    washroom= ? ,
    step = GREATEST(step, 3)
    WHERE prop_id = ?
      AND user_id = ?
    `,
      [rooms, lift, washroom, prop_id, user_id],
    );

    return {
      prop_id,
      step: 3,
      amenities,
      prop_highs,
      action: "updated",
    };
  }

  static async updatePropertyStep4(data: any) {
    const { body, user_id, prop_id } = data;

    const {
      cover = null,
      pr_img = [],
      pr_vid = [],
      patta = [],
      pr_doc = [],
    } = body || {};

    const property: any = await executeQuery(
      `
    SELECT id
    FROM prop_form
    WHERE prop_id = ?
      AND user_id = ?
    LIMIT 1
    `,
      [prop_id, user_id],
    );

    if (!property.length) {
      throw new Error("Property not found");
    }

    await executeQuery(
      `
    DELETE FROM prop_media
    WHERE prop_id = ?
    `,
      [prop_id],
    );

    const mediaValues: any[] = [];

    if (cover) {
      mediaValues.push([prop_id, cover, "cover"]);
    }

    pr_img.forEach((media_id: number) => {
      mediaValues.push([prop_id, media_id, "pr_img"]);
    });

    pr_vid.forEach((media_id: number) => {
      mediaValues.push([prop_id, media_id, "pr_vid"]);
    });

    patta.forEach((media_id: number) => {
      mediaValues.push([prop_id, media_id, "patta"]);
    });

    pr_doc.forEach((media_id: number) => {
      mediaValues.push([prop_id, media_id, "pr_doc"]);
    });

    if (mediaValues.length > 0) {
      await executeQuery(
        `
      INSERT INTO prop_media (
        prop_id,
        media_id,
        type
      )
      VALUES ?
      `,
        [mediaValues],
      );
    }

    await executeQuery(
      `
    UPDATE prop_form
    SET step = GREATEST(step, 4)
    WHERE prop_id = ?
      AND user_id = ?
    `,
      [prop_id, user_id],
    );

    return {
      prop_id,
      step: 4,
    };
  }

  static async getProperty(data: any) {
    const { prop_id, type } = data;

    const property = await this.getPropertyData(prop_id);

    if (!property.length) {
      throw new Error("Property not found");
    }

    const amenities = await this.getPropertyAmenities(prop_id);

    const property_highs = await this.getPropertyHighs(prop_id);

    const media = await this.getPropertyMedia(prop_id);

    let categoryData = {};

    return {
      ...property[0],
      ...categoryData,
      amenities,
      property_highs,
      media,
    };
  }

  static async getPropertyMedia(prop_id: string) {
    const rows: any = await executeQuery(
      `
    SELECT
      pm.id,
      pm.media_id,
      pm.type,
      m.url
    FROM prop_media pm
    LEFT JOIN media m
      ON m.id = pm.media_id
    WHERE pm.prop_id = ?
    ORDER BY pm.id ASC
    `,
      [prop_id],
    );

    return {
      cover:
        rows
          .filter((item: any) => item.type === "cover")
          .map((item: any) => ({
            id: item.media_id,
            url: `${process.env.ASSET_URL}${item.url}`,
          }))[0] || null,

      images: rows
        .filter((item: any) => item.type === "pr_img")
        .map((item: any) => ({
          id: item.media_id,
          url: `${process.env.ASSET_URL}${item.url}`,
        })),

      videos: rows
        .filter((item: any) => item.type === "pr_vid")
        .map((item: any) => ({
          id: item.media_id,
          url: `${process.env.ASSET_URL}${item.url}`,
        })),

      patta: rows
        .filter((item: any) => item.type === "patta")
        .map((item: any) => ({
          id: item.media_id,
          url: `${process.env.ASSET_URL}${item.url}`,
        })),

      documents: rows
        .filter((item: any) => item.type === "pr_doc")
        .map((item: any) => ({
          id: item.media_id,
          url: `${process.env.ASSET_URL}${item.url}`,
        })),
    };
  }

  static async getPropertyAmenities(prop_id: string) {
    const rows: any = await executeQuery(
      `
    SELECT
      pa.amenity_id AS id,
      a.name
    FROM prop_amenities pa
    INNER JOIN amenities a
      ON a.id = pa.amenity_id
    WHERE pa.prop_id = ?
      AND a.status = 1
    ORDER BY pa.id ASC
    `,
      [prop_id],
    );

    return rows.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }

  static async getPropertyHighs(prop_id: string) {
    const rows: any = await executeQuery(
      `
    SELECT 
      ph.high_id AS id,
      h.name
    FROM prop_highs ph
    INNER JOIN highlights h
      ON h.id = ph.high_id
    WHERE ph.prop_id = ?
      AND h.status = 'active'
    ORDER BY ph.id ASC
    `,
      [prop_id],
    );

    return rows.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }

  static async getPropertyData(prop_id: string) {
    const rows: any = await executeQuery(
      `
    SELECT
      id,
      prop_id,
      category,
      sub_category,
      country,
      state,
      district,
      city,
      user_id,
      map,
      prop_name,
      prop_area,
      area_unit,
      road_plan,
      road_length,
      road_length_unit,
      path_way,
      length,
      length_unit,
      width,
      width_unit,
      c_well,
      i_well,
      electricity,
      hp,
      facing,
      construct,
      construct_type,
      other_type,
      step,
      status,
      created_at,
      updated_at
    FROM prop_form
    WHERE prop_id = ?
    LIMIT 1
    `,
      [prop_id],
    );

    return rows;
  }
}

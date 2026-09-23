"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormModule = void 0;
const nanoid_1 = require("nanoid");
const helper_1 = require("../utils/helper");
const generatePropertyId = (0, nanoid_1.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 5);
class FormModule {
    static async savePropertyStep(data) {
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
    static async createPropertyStep1(data) {
        const { category, sub_category, country, state, district, city, map_link } = data.body;
        const user_id = data.user_id;
        const prop_id = data.prop_id;
        if (prop_id) {
            const result = await (0, helper_1.executeQuery)(`
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
        `, [
                category,
                sub_category,
                country,
                state,
                district,
                city,
                map_link,
                prop_id,
                user_id,
            ]);
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
        const result = await (0, helper_1.executeQuery)(`
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
      `, [
            newPropId,
            category,
            sub_category,
            country,
            state,
            district,
            city,
            user_id,
            map_link,
        ]);
        return {
            prop_id: newPropId,
            id: result.insertId,
            step: 1,
            action: "created",
        };
    }
    static async updatePropertyStep2(data) {
        const { body, user_id, prop_id } = data;
        const { prop_name, prop_area, area_unit, road_plan, road_length, road_length_unit, pathway, length, length_unit, width, width_unit, c_well, i_well, electricity, hp, facing, construct, construct_type, other_type, min_price, max_price, carpet_area, carp_unit, build, build_unit, super_build, super_build_unit, total_floor, your_floor, avail_status, bhk, } = body;
        const result = await (0, helper_1.executeQuery)(`
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
    `, [
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
        ]);
        if (result.affectedRows === 0) {
            throw new Error("Property not found");
        }
        return {
            prop_id,
            step: 2,
            action: "updated",
        };
    }
    static async updatePropertyStep3(data) {
        const { body, user_id, prop_id } = data;
        const { amenities = [], prop_highs = [], rooms, lift, washroom } = body;
        const property = await (0, helper_1.executeQuery)(`
    SELECT id
    FROM prop_form
    WHERE prop_id = ?
      AND user_id = ?
    LIMIT 1
    `, [prop_id, user_id]);
        if (!property.length) {
            throw new Error("Property not found");
        }
        await (0, helper_1.executeQuery)(`
    DELETE FROM prop_amenities
    WHERE prop_id = ?
    `, [prop_id]);
        if (amenities.length > 0) {
            const amenityValues = amenities.map((amenity_id) => [
                prop_id,
                amenity_id,
            ]);
            await (0, helper_1.executeQuery)(`
      INSERT INTO prop_amenities (
        prop_id,
        amenity_id
      )
      VALUES ?
      `, [amenityValues]);
        }
        await (0, helper_1.executeQuery)(`
    DELETE FROM prop_highs
    WHERE prop_id = ?
    `, [prop_id]);
        if (prop_highs.length > 0) {
            const highValues = prop_highs.map((high_id) => [
                prop_id,
                high_id,
            ]);
            await (0, helper_1.executeQuery)(`
      INSERT INTO prop_highs (
        prop_id,
        high_id
      )
      VALUES ?
      `, [highValues]);
        }
        await (0, helper_1.executeQuery)(`
    UPDATE prop_form
    SET rooms = ?,
    lift = ?,
    washroom= ? ,
    step = GREATEST(step, 3)
    WHERE prop_id = ?
      AND user_id = ?
    `, [rooms, lift, washroom, prop_id, user_id]);
        return {
            prop_id,
            step: 3,
            amenities,
            prop_highs,
            action: "updated",
        };
    }
    static async updatePropertyStep4(data) {
        const { body, user_id, prop_id, status } = data;
        const { cover = null, pr_img = [], pr_vid = [], patta = [], pr_doc = [], } = body || {};
        const property = await (0, helper_1.executeQuery)(`
    SELECT id
    FROM prop_form
    WHERE prop_id = ?
      AND user_id = ?
    LIMIT 1
    `, [prop_id, user_id]);
        if (!property.length) {
            throw new Error("Property not found");
        }
        await (0, helper_1.executeQuery)(`
    DELETE FROM prop_media
    WHERE prop_id = ?
    `, [prop_id]);
        const mediaValues = [];
        if (cover) {
            mediaValues.push([prop_id, cover, "cover"]);
        }
        pr_img.forEach((media_id) => {
            mediaValues.push([prop_id, media_id, "pr_img"]);
        });
        pr_vid.forEach((media_id) => {
            mediaValues.push([prop_id, media_id, "pr_vid"]);
        });
        patta.forEach((media_id) => {
            mediaValues.push([prop_id, media_id, "patta"]);
        });
        pr_doc.forEach((media_id) => {
            mediaValues.push([prop_id, media_id, "pr_doc"]);
        });
        if (mediaValues.length > 0) {
            await (0, helper_1.executeQuery)(`
      INSERT INTO prop_media (
        prop_id,
        media_id,
        type
      )
      VALUES ?
      `, [mediaValues]);
        }
        await (0, helper_1.executeQuery)(`
    UPDATE prop_form
    SET step = GREATEST(step, 4),
    status =  ? 
    WHERE prop_id = ?
      AND user_id = ?
    `, [prop_id, status, user_id]);
        return {
            prop_id,
            step: 4,
        };
    }
    static async getProperty(data) {
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
    static async getPropertyMedia(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
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
    `, [prop_id]);
        return {
            cover: rows
                .filter((item) => item.type === "cover")
                .map((item) => ({
                id: item.media_id,
                url: `${process.env.ASSET_URL}${item.url}`,
            }))[0] || null,
            images: rows
                .filter((item) => item.type === "pr_img")
                .map((item) => ({
                id: item.media_id,
                url: `${process.env.ASSET_URL}${item.url}`,
            })),
            videos: rows
                .filter((item) => item.type === "pr_vid")
                .map((item) => ({
                id: item.media_id,
                url: `${process.env.ASSET_URL}${item.url}`,
            })),
            patta: rows
                .filter((item) => item.type === "patta")
                .map((item) => ({
                id: item.media_id,
                url: `${process.env.ASSET_URL}${item.url}`,
            })),
            documents: rows
                .filter((item) => item.type === "pr_doc")
                .map((item) => ({
                id: item.media_id,
                url: `${process.env.ASSET_URL}${item.url}`,
            })),
        };
    }
    static async getPropertyAmenities(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT
      pa.amenity_id AS id,
      a.name
    FROM prop_amenities pa
    INNER JOIN amenities a
      ON a.id = pa.amenity_id
    WHERE pa.prop_id = ?
      AND a.status = 1
    ORDER BY pa.id ASC
    `, [prop_id]);
        return rows.map((item) => ({
            id: item.id,
            name: item.name,
        }));
    }
    static async getPropertyHighs(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT 
      ph.high_id AS id,
      h.name
    FROM prop_highs ph
    INNER JOIN highlights h
      ON h.id = ph.high_id
    WHERE ph.prop_id = ?
      AND h.status = 'active'
    ORDER BY ph.id ASC
    `, [prop_id]);
        return rows.map((item) => ({
            id: item.id,
            name: item.name,
        }));
    }
    static async getPropertyData(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
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
    `, [prop_id]);
        return rows;
    }
    // static async getPropertyBasedOnTypes(data: any) {
    //   const { status, type, location, page, limit, offset } = data;
    //   let baseWhere = `WHERE pf.created_at IS NOT NULL`;
    //   const baseParams: any[] = [];
    //   if (status) {
    //     baseWhere += ` AND pf.status = ?`;
    //     baseParams.push(status);
    //   }
    //   if (type) {
    //     baseWhere += ` AND pf.category = ?`;
    //     baseParams.push(type);
    //   }
    //   let city: string | null = null;
    //   let district: string | null = null;
    //   let state: string | null = null;
    //   if (location) {
    //     const locationParts = String(location)
    //       .split(",")
    //       .map((item) => item.trim())
    //       .filter(Boolean);
    //     city = locationParts[0] || null;
    //     district = locationParts[1] || null;
    //     state = locationParts[2] || null;
    //   }
    //   const fetchProperties = async (
    //     locationWhere: string,
    //     locationParams: any[],
    //     fetchLimit: number,
    //   ) => {
    //     if (fetchLimit <= 0) {
    //       return [];
    //     }
    //     return await executeQuery(
    //       `
    //     SELECT
    //       pf.id,
    //       pf.prop_id,
    //       pf.prop_name,
    //       pf.category,
    //       pc.name AS category_name,
    //       pf.sub_category,
    //       psc.sub_name AS sub_category_name,
    //       pf.country,
    //       pf.state,
    //       pf.district,
    //       pf.city,
    //       pf.prop_area,
    //       pf.area_unit,
    //       pf.min_price,
    //       pf.max_price,
    //       pf.status,
    //       pf.created_at
    //     FROM prop_form pf
    //     LEFT JOIN property pc
    //       ON pc.id = pf.category
    //     LEFT JOIN prop_sub_category psc
    //       ON psc.id = pf.sub_category
    //     ${baseWhere}
    //     ${locationWhere}
    //     ORDER BY pf.id DESC
    //     LIMIT ?
    //     `,
    //       [...baseParams, ...locationParams, fetchLimit],
    //     );
    //   };
    //   // ---------------------------------------
    //   // LOCATION BUCKET
    //   // ---------------------------------------
    //   let properties: any[] = [];
    //   if (city && district && state) {
    //     // -----------------------------------
    //     // 1. CITY + DISTRICT + STATE
    //     // -----------------------------------
    //     properties = await fetchProperties(
    //       `
    //     AND LOWER(TRIM(pf.city)) = LOWER(TRIM(?))
    //     AND LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
    //     AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
    //     `,
    //       [city, district, state],
    //       limit,
    //     );
    //     // -----------------------------------
    //     // 2. DISTRICT + STATE
    //     // Only if first bucket < limit
    //     // -----------------------------------
    //     if (properties.length < limit) {
    //       const remaining = limit - properties.length;
    //       const districtProperties = await fetchProperties(
    //         `
    //       AND LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
    //       AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
    //       `,
    //         [district, state],
    //         remaining,
    //       );
    //       properties = [...properties, ...districtProperties];
    //     }
    //     // -----------------------------------
    //     // 3. STATE ONLY
    //     // Only if still < limit
    //     // -----------------------------------
    //     if (properties.length < limit) {
    //       const remaining = limit - properties.length;
    //       const stateProperties = await fetchProperties(
    //         `
    //       AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
    //       `,
    //         [state],
    //         remaining,
    //       );
    //       properties = [...properties, ...stateProperties];
    //     }
    //   } else {
    //     // No valid location supplied
    //     properties = await fetchProperties("", [], limit);
    //   }
    //   // ---------------------------------------
    //   // PAGINATION
    //   // ---------------------------------------
    //   // Since location bucket is max 5, apply
    //   // pagination after bucket selection.
    //   // ---------------------------------------
    //   const total = properties.length;
    //   const paginatedProperties = properties.slice(offset, offset + limit);
    //   // ---------------------------------------
    //   // COVER IMAGE
    //   // ---------------------------------------
    //   const propertiesWithCover = await Promise.all(
    //     paginatedProperties.map(async (property: any) => {
    //       const media = await this.getPropertyMedia(property.prop_id);
    //       return {
    //         ...property,
    //         cover_image: media.cover,
    //       };
    //     }),
    //   );
    //   return {
    //     properties: propertiesWithCover,
    //     pagination: {
    //       total,
    //       page,
    //       limit,
    //       totalPages: Math.ceil(total / limit),
    //     },
    //   };
    // }
    // bookmark
    static async getPropertyBasedOnTypes(data) {
        const { status, type, location, user_id, page, limit, offset } = data;
        let baseWhere = `WHERE pf.created_at IS NOT NULL`;
        const baseParams = [];
        if (user_id) {
            baseWhere += ` AND pf.user_id = ?`;
            baseParams.push(user_id);
        }
        // ---------------------------------------
        // STATUS
        // ---------------------------------------
        if (status) {
            baseWhere += ` AND pf.status = ?`;
            baseParams.push(status);
        }
        // ---------------------------------------
        // PROPERTY TYPE
        // ---------------------------------------
        if (type) {
            baseWhere += ` AND pf.category = ?`;
            baseParams.push(type);
        }
        // ---------------------------------------
        // LOCATION
        // ---------------------------------------
        let city = null;
        let district = null;
        let state = null;
        if (location) {
            const locationParts = String(location)
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
            city = locationParts[0] || null;
            district = locationParts[1] || null;
            state = locationParts[2] || null;
        }
        // ---------------------------------------
        // LOCATION WHERE
        // ---------------------------------------
        let locationWhere = "";
        const locationParams = [];
        if (city && district && state) {
            locationWhere = `
      AND (
        (
          LOWER(TRIM(pf.city)) = LOWER(TRIM(?))
          AND LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
          AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
        )
        OR
        (
          LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
          AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
        )
        OR
        (
          LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
        )
      )
    `;
            locationParams.push(city, district, state, district, state, state);
        }
        // ---------------------------------------
        // COUNT
        // ---------------------------------------
        const countQuery = `
    SELECT COUNT(*) AS total
    FROM prop_form pf

    ${baseWhere}
    ${locationWhere}
  `;
        const countResult = await (0, helper_1.executeQuery)(countQuery, [
            ...baseParams,
            ...locationParams,
        ]);
        const total = Number(countResult[0]?.total || 0);
        // ---------------------------------------
        // PROPERTY DATA
        // ---------------------------------------
        const dataQuery = `
    SELECT
      pf.id,
      pf.prop_id,
      pf.prop_name,

      pf.category,
      pc.name AS category_name,

      pf.sub_category,
      psc.sub_name AS sub_category_name,

      pf.country,
      pf.state,
      pf.district,
      pf.city,
      pf.prop_area,
      pf.area_unit,
      pf.min_price,
      pf.max_price,
      pf.status,
      pf.requested_at,
      pf.approved_at,
      pf.rejected_at,
      pf.rejected_reason,
      pf.purchased_at,
      pf.expired_at,
      pf.sold_at,
      pf.purchase_plan,
      pf.created_at

    FROM prop_form pf

    LEFT JOIN property pc
      ON pc.id = pf.category

    LEFT JOIN prop_sub_category psc
      ON psc.id = pf.sub_category

    ${baseWhere}
    ${locationWhere}

    ${city && district && state
            ? `
      ORDER BY
        CASE
          WHEN
            LOWER(TRIM(pf.city)) = LOWER(TRIM(?))
            AND LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
            AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
          THEN 1

          WHEN
            LOWER(TRIM(pf.district)) = LOWER(TRIM(?))
            AND LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
          THEN 2

          WHEN
            LOWER(TRIM(pf.state)) = LOWER(TRIM(?))
          THEN 3

          ELSE 4
        END,
        pf.id DESC
      `
            : `
      ORDER BY pf.id DESC
      `}

    LIMIT ? OFFSET ?
  `;
        const dataParams = [...baseParams, ...locationParams];
        // ORDER BY CASE parameters
        if (city && district && state) {
            dataParams.push(city, district, state, district, state, state);
        }
        // Pagination
        dataParams.push(limit, offset);
        const properties = await (0, helper_1.executeQuery)(dataQuery, dataParams);
        // ---------------------------------------
        // COVER IMAGE
        // ---------------------------------------
        const propertiesWithCover = await Promise.all(properties.map(async (property) => {
            const media = await this.getPropertyMedia(property.prop_id);
            return {
                ...property,
                cover_image: media.cover,
            };
        }));
        // ---------------------------------------
        // RESPONSE
        // ---------------------------------------
        return {
            properties: propertiesWithCover,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getPropertyCover(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT
      pm.media_id,
      m.url
    FROM prop_media pm
    LEFT JOIN media m
      ON m.id = pm.media_id
    WHERE pm.prop_id = ?
      AND pm.type = 'cover'
    ORDER BY pm.id ASC
    LIMIT 1
    `, [prop_id]);
        if (!rows.length) {
            return null;
        }
        return {
            id: rows[0].media_id,
            url: `${process.env.ASSET_URL}${rows[0].url}`,
        };
    }
    static async getPropertyOneHigh(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT 
      ph.high_id AS id,
      h.name
    FROM prop_highs ph
    INNER JOIN highlights h
      ON h.id = ph.high_id
    WHERE ph.prop_id = ?
      AND h.status = 'active'
    ORDER BY ph.id ASC
    LIMIT 1
    `, [prop_id]);
        return rows[0]
            ? {
                id: rows[0].id,
                name: rows[0].name,
            }
            : null;
    }
    static async getPropOneAmenity(prop_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT
      pa.amenity_id AS id,
      a.name
    FROM prop_amenities pa
    INNER JOIN amenities a
      ON a.id = pa.amenity_id
    WHERE pa.prop_id = ?
      AND a.status = 1
    ORDER BY pa.id ASC
    LIMIT 1
    `, [prop_id]);
        return rows[0]
            ? {
                id: rows[0].id,
                name: rows[0].name,
            }
            : null;
    }
    static async getBookmarkProperties(data) {
        const { user_id, page = 1, limit = 10, offset = 0 } = data;
        const countResult = await (0, helper_1.executeQuery)(`
    SELECT COUNT(*) AS total
    FROM prop_bookmarks pb
    INNER JOIN prop_form pf
      ON pf.prop_id = pb.prop_id
    WHERE pb.user_id = ?
    `, [user_id]);
        const total = Number(countResult[0]?.total || 0);
        const properties = await (0, helper_1.executeQuery)(`
    SELECT
      pf.id,
      pf.prop_id,

      pf.category,
      pc.name AS category_name,

      pf.sub_category,
      psc.sub_name AS sub_category_name,

      pf.country,
      pf.state,
      pf.district,
      pf.city,

      pf.user_id,

      pf.map,
      pf.prop_name,
      pf.prop_area,
      pf.area_unit,

      pf.road_plan,
      pf.road_length,
      pf.road_length_unit,

      pf.path_way,

      pf.length,
      pf.length_unit,

      pf.width,
      pf.width_unit,

      pf.c_well,
      pf.i_well,
      pf.electricity,
      pf.hp,

      pf.facing,
      pf.construct,
      pf.construct_type,
      pf.other_type,

      pf.step,
      pf.status,

      pf.created_at,
      pf.updated_at,

      pb.created_at AS bookmarked_at

    FROM prop_bookmarks pb

    INNER JOIN prop_form pf
      ON pf.prop_id = pb.prop_id

    LEFT JOIN property pc
      ON pc.id = pf.category

    LEFT JOIN prop_sub_category psc
      ON psc.id = pf.sub_category

    WHERE pb.user_id = ?
    
    ORDER BY pb.id DESC

    LIMIT ? OFFSET ?
    `, [user_id, limit, offset]);
        const propertiesWithDetails = await Promise.all(properties.map(async (property) => {
            const [media, amenities, highlights] = await Promise.all([
                this.getPropertyCover(property.prop_id),
                this.getPropOneAmenity(property.prop_id),
                this.getPropertyOneHigh(property.prop_id),
            ]);
            return {
                ...property,
                is_bookmarked: 1,
                media,
                amenities,
                highlights,
            };
        }));
        return {
            properties: propertiesWithDetails,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.FormModule = FormModule;

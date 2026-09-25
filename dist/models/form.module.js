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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'inprogress')
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
        const { body, user_id, prop_id } = data;
        const { cover = null, pr_img = [], pr_vid = [], patta = [], pr_doc = [], status, requested_at, approved_at, } = body || {};
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
        const updateFields = [];
        const updateParams = [];
        if (status !== undefined) {
            updateFields.push("status = ?");
            updateParams.push(status);
        }
        if (requested_at !== undefined) {
            updateFields.push("requested_at = ?");
            updateParams.push(requested_at);
        }
        if (approved_at !== undefined) {
            updateFields.push("approved_at = ?");
            updateParams.push(approved_at);
        }
        updateFields.push("step = GREATEST(step, 4)");
        await (0, helper_1.executeQuery)(`
    UPDATE prop_form
    
      SET ${updateFields.join(", ")}
    WHERE prop_id = ?
      AND user_id = ?
    `, [...updateParams, prop_id, user_id]);
        return {
            prop_id,
            step: 4,
        };
    }
    static async getProperty(data) {
        const { prop_id, type, user_id } = data;
        const property = await this.getPropertyData(prop_id);
        if (!property.length) {
            throw new Error("Property not found");
        }
        const amenities = await this.getPropertyAmenities(prop_id);
        const property_highs = await this.getPropertyHighs(prop_id);
        const media = await this.getPropertyMedia(prop_id);
        let is_bookmarked = 0;
        if (user_id) {
            is_bookmarked = await this.getPropertyBookmarkStatus(user_id, prop_id);
            if (prop_id) {
                await this.addRecentView(user_id, prop_id);
            }
        }
        let categoryData = {};
        return {
            ...property[0],
            ...categoryData,
            amenities,
            property_highs,
            media,
            is_bookmarked,
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
      min_price,
      max_price,
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
      updated_at,
      purchase_plan
    FROM prop_form
    WHERE prop_id = ?
    LIMIT 1
    `, [prop_id]);
        return rows;
    }
    // recent
    static async addRecentView(user_id, prop_id) {
        await (0, helper_1.executeQuery)(`
    INSERT INTO recent_views (
      user_id,
      prop_id,
      created_at
    )
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      created_at = NOW()
    `, [user_id, prop_id]);
        // Keep only latest 30 recent views for this user
        await (0, helper_1.executeQuery)(`
    DELETE FROM recent_views
    WHERE user_id = ?
      AND id NOT IN (
        SELECT id
        FROM (
          SELECT id
          FROM recent_views
          WHERE user_id = ?
          ORDER BY created_at DESC, id DESC
          LIMIT 30
        ) AS latest_views
      )
    `, [user_id, user_id]);
        return true;
    }
    static async getRecentViews(data) {
        const { user_id } = data;
        const page = Math.max(Number(data.page) || 1, 1);
        const limit = Math.min(Math.max(Number(data.limit) || 10, 1), 30);
        const offset = (page - 1) * limit;
        if (!user_id) {
            throw new Error("User ID is required");
        }
        // Total recent views
        const countRows = await (0, helper_1.executeQuery)(`
    SELECT COUNT(*) AS total
    FROM recent_views
    WHERE user_id = ?
    `, [user_id]);
        const total = Number(countRows?.[0]?.total || 0);
        // Get recent view records
        const recentViews = await (0, helper_1.executeQuery)(`
    SELECT
      id,
      user_id,
      prop_id,
      created_at
    FROM recent_views
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ? OFFSET ?
    `, [user_id, limit, offset]);
        const properties = [];
        for (const recent of recentViews) {
            // Get property basic data
            const property = await this.getPropertyData(recent.prop_id);
            if (!property?.length) {
                continue;
            }
            // Bookmark status
            const is_bookmarked = await this.getPropertyBookmarkStatus(user_id, recent.prop_id);
            // Get media
            const media = await this.getPropertyMedia(recent.prop_id);
            // Cover image only
            let cover_image = null;
            if (media) {
                // If getPropertyMedia returns object structure
                if (media.cover) {
                    cover_image = media.cover;
                }
                // If getPropertyMedia returns array
                if (Array.isArray(media)) {
                    const cover = media.find((item) => item.is_cover === 1 ||
                        item.type === "cover" ||
                        item.media_type === "cover");
                    if (cover) {
                        cover_image = cover;
                    }
                }
            }
            // Amenities
            const amenities = await this.getPropertyAmenities(recent.prop_id);
            // Highlights
            const property_highs = await this.getPropertyHighs(recent.prop_id);
            properties.push({
                ...property[0],
                viewed_at: recent.created_at,
                is_bookmarked,
                cover_image,
                amenities,
                property_highs,
            });
        }
        const limitedTotal = Math.min(total, 30);
        return {
            properties: properties,
            pagination: {
                page,
                limit,
                total: limitedTotal,
                totalPages: Math.ceil(limitedTotal / limit),
            },
        };
    }
    static async getPropertyBasedOnTypes(data) {
        const { status, type, location, user_id, min_price, max_price, amenities, prop_highlights, page, limit, offset, } = data;
        let baseWhere = `WHERE pf.created_at IS NOT NULL`;
        const baseParams = [];
        // ---------------------------------------
        // USER
        // ---------------------------------------
        if (user_id) {
            baseWhere += ` AND pf.user_id = ?`;
            baseParams.push(user_id);
        }
        // ---------------------------------------
        // STATUS
        // ---------------------------------------
        if (Array.isArray(status) && status.length > 0) {
            const placeholders = status.map(() => "?").join(",");
            baseWhere += ` AND pf.status IN (${placeholders})`;
            baseParams.push(...status);
        }
        // ---------------------------------------
        // PROPERTY TYPE
        // ---------------------------------------
        if (type) {
            baseWhere += ` AND pf.category = ?`;
            baseParams.push(type);
        }
        // ---------------------------------------
        // MIN PRICE
        // ---------------------------------------
        if (min_price !== null && min_price !== undefined) {
            baseWhere += ` AND pf.min_price >= ?`;
            baseParams.push(min_price);
        }
        // ---------------------------------------
        // MAX PRICE
        // ---------------------------------------
        if (max_price !== null && max_price !== undefined) {
            baseWhere += ` AND pf.max_price <= ?`;
            baseParams.push(max_price);
        }
        // ---------------------------------------
        // AMENITIES
        // ---------------------------------------
        if (Array.isArray(amenities) && amenities.length > 0) {
            const placeholders = amenities.map(() => "?").join(",");
            baseWhere += `
      AND EXISTS (
        SELECT 1
        FROM prop_amenities pa_filter
        WHERE pa_filter.prop_id = pf.prop_id
        AND pa_filter.amenity_id IN (${placeholders})
      )
    `;
            baseParams.push(...amenities);
        }
        // ---------------------------------------
        // PROPERTY HIGHLIGHTS
        // ---------------------------------------
        if (Array.isArray(prop_highlights) && prop_highlights.length > 0) {
            const placeholders = prop_highlights.map(() => "?").join(",");
            baseWhere += `
      AND EXISTS (
        SELECT 1
        FROM prop_highs ph_filter
        WHERE ph_filter.prop_id = pf.prop_id
        AND ph_filter.high_id IN (${placeholders})
      )
    `;
            baseParams.push(...prop_highlights);
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
      pf.created_at,

      CASE
        WHEN ? IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM prop_bookmarks pb
            WHERE pb.user_id = ?
              AND pb.prop_id = pf.prop_id
          )
        THEN 1
        ELSE 0
      END AS is_bookmarked

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
        // ---------------------------------------
        // DATA PARAMS
        // ---------------------------------------
        const dataParams = [
            user_id || null,
            user_id || null,
            ...baseParams,
            ...locationParams,
        ];
        // ---------------------------------------
        // ORDER BY LOCATION PARAMS
        // ---------------------------------------
        if (city && district && state) {
            dataParams.push(city, district, state, district, state, state);
        }
        // ---------------------------------------
        // PAGINATION
        // ---------------------------------------
        dataParams.push(limit, offset);
        const properties = await (0, helper_1.executeQuery)(dataQuery, dataParams);
        // ---------------------------------------
        // COVER + ONE AMENITY + ONE HIGHLIGHT
        // ---------------------------------------
        const propertiesWithDetails = await Promise.all(properties.map(async (property) => {
            const [media, amenities, highlights] = await Promise.all([
                this.getPropertyCover(property.prop_id),
                this.getPropOneAmenity(property.prop_id),
                this.getPropertyOneHigh(property.prop_id),
            ]);
            return {
                ...property,
                cover_image: media || null,
                amenities: Array.isArray(amenities)
                    ? amenities[0] || null
                    : amenities || null,
                property_highs: Array.isArray(highlights)
                    ? highlights[0] || null
                    : highlights || null,
            };
        }));
        // ---------------------------------------
        // RESPONSE
        // ---------------------------------------
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
    // static async getBookmarkProperties(data: any) {
    //   const { user_id, page = 1, limit = 10, offset = 0, type, search } = data;
    //   const countResult: any = await executeQuery(
    //     `
    //   SELECT COUNT(*) AS total
    //   FROM prop_bookmarks pb
    //   INNER JOIN prop_form pf
    //     ON pf.prop_id = pb.prop_id
    //   WHERE pb.user_id = ?
    //   `,
    //     [user_id],
    //   );
    //   const total = Number(countResult[0]?.total || 0);
    //   const properties: any[] = await executeQuery(
    //     `
    //   SELECT
    //     pf.id,
    //     pf.prop_id,
    //     pf.category,
    //     pc.name AS category_name,
    //     pf.sub_category,
    //     psc.sub_name AS sub_category_name,
    //     pf.country,
    //     pf.state,
    //     pf.district,
    //     pf.city,
    //     pf.user_id,
    //     pf.map,
    //     pf.prop_name,
    //     pf.prop_area,
    //     pf.area_unit,
    //     pf.road_plan,
    //     pf.road_length,
    //     pf.road_length_unit,
    //     pf.path_way,
    //     pf.length,
    //     pf.length_unit,
    //     pf.width,
    //     pf.width_unit,
    //     pf.c_well,
    //     pf.i_well,
    //     pf.electricity,
    //     pf.hp,
    //     pf.facing,
    //     pf.construct,
    //     pf.construct_type,
    //     pf.other_type,
    //     pf.step,
    //     pf.status,
    //     pf.created_at,
    //     pf.updated_at,
    //     pb.created_at AS bookmarked_at
    //   FROM prop_bookmarks pb
    //   INNER JOIN prop_form pf
    //     ON pf.prop_id = pb.prop_id
    //   LEFT JOIN property pc
    //     ON pc.id = pf.category
    //   LEFT JOIN prop_sub_category psc
    //     ON psc.id = pf.sub_category
    //   WHERE pb.user_id = ?
    //   ORDER BY pb.id DESC
    //   LIMIT ? OFFSET ?
    //   `,
    //     [user_id, limit, offset],
    //   );
    //   const propertiesWithDetails = await Promise.all(
    //     properties.map(async (property: any) => {
    //       const [media, amenities, highlights] = await Promise.all([
    //         this.getPropertyCover(property.prop_id),
    //         this.getPropOneAmenity(property.prop_id),
    //         this.getPropertyOneHigh(property.prop_id),
    //       ]);
    //       return {
    //         ...property,
    //         is_bookmarked: 1,
    //         media,
    //         amenities,
    //         highlights,
    //       };
    //     }),
    //   );
    //   return {
    //     properties: propertiesWithDetails,
    //     pagination: {
    //       total,
    //       page,
    //       limit,
    //       totalPages: Math.ceil(total / limit),
    //     },
    //   };
    // }
    static async getBookmarkProperties(data) {
        const { user_id, page = 1, limit = 10, offset = 0, type, search } = data;
        let filterWhere = `
    WHERE pb.user_id = ?
  `;
        const filterParams = [user_id];
        if (type) {
            filterWhere += `
      AND pf.category = ?
    `;
            filterParams.push(Number(type));
        }
        if (search) {
            filterWhere += `
      AND (
        pf.country LIKE ?
        OR pf.state LIKE ?
        OR pf.district LIKE ?
        OR pf.city LIKE ? OR pf.prop_name LIKE ?
      )
    `;
            const searchValue = `%${String(search).trim()}%`;
            filterParams.push(searchValue, searchValue, searchValue, searchValue, searchValue);
        }
        const countResult = await (0, helper_1.executeQuery)(`
    SELECT COUNT(*) AS total

    FROM prop_bookmarks pb

    INNER JOIN prop_form pf
      ON pf.prop_id = pb.prop_id

    ${filterWhere}
    `, filterParams);
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

    ${filterWhere}

    ORDER BY pb.id DESC

    LIMIT ? OFFSET ?
    `, [...filterParams, limit, offset]);
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
        // ==========================================
        // RESPONSE
        // ==========================================
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
    static async getPropertyBookmarkStatus(user_id, prop_id) {
        const query = `
    SELECT 1
    FROM prop_bookmarks
    WHERE user_id = ?
      AND prop_id = ?
    LIMIT 1
  `;
        const result = await (0, helper_1.executeQuery)(query, [user_id, prop_id]);
        return result.length > 0 ? 1 : 0;
    }
    // get nearby
    static async getNearbyProperties(prop_id) {
        // ==========================================
        // CURRENT PROPERTY
        // ==========================================
        const currentResult = await (0, helper_1.executeQuery)(`
    SELECT
      prop_id,
      category,
      country,
      state,
      district,
      city
    FROM prop_form
    WHERE prop_id = ?
    LIMIT 1
    `, [prop_id]);
        if (!currentResult.length) {
            throw new Error("Property not found");
        }
        const currentProperty = currentResult[0];
        const { category, country, state, district, city } = currentProperty;
        // ==========================================
        // STRICT CATEGORY CHECK
        // ==========================================
        if (!category) {
            return [];
        }
        // ==========================================
        // FETCH MAX 6
        // ==========================================
        const nearbyProperties = [];
        const addedPropIds = new Set();
        // ==========================================
        // HELPER
        // ==========================================
        const getProperties = async (locationField, locationValue) => {
            if (!locationValue) {
                return [];
            }
            const query = `
      SELECT
        pf.id,
        pf.prop_id,

        pf.category,
        pc.name AS category_name,

        pf.sub_category,
        psc.sub_name AS sub_category_name,

        pf.prop_name,

        pf.country,
        pf.state,
        pf.district,
        pf.city,

        pf.user_id,

        pf.map,

        pf.prop_area,
        pf.area_unit,

        pf.min_price,
        pf.max_price,

        pf.status,
        pf.purchase_plan,
        pf.created_at,
        pf.updated_at

      FROM prop_form pf

      LEFT JOIN property pc
        ON pc.id = pf.category

      LEFT JOIN prop_sub_category psc
        ON psc.id = pf.sub_category

      WHERE pf.category = ?

        AND pf.${locationField} = ?

        AND pf.prop_id != ?

      ORDER BY pf.id DESC

      LIMIT 6
    `;
            return await (0, helper_1.executeQuery)(query, [category, locationValue, prop_id]);
        };
        // ==========================================
        // 1. SAME CITY
        // ==========================================
        if (city) {
            const cityProperties = await getProperties("city", city);
            for (const property of cityProperties) {
                if (nearbyProperties.length >= 6) {
                    break;
                }
                if (!addedPropIds.has(property.prop_id)) {
                    nearbyProperties.push(property);
                    addedPropIds.add(property.prop_id);
                }
            }
        }
        // ==========================================
        // 2. SAME DISTRICT
        // ==========================================
        if (nearbyProperties.length < 6 && district) {
            const districtProperties = await getProperties("district", district);
            for (const property of districtProperties) {
                if (nearbyProperties.length >= 6) {
                    break;
                }
                if (!addedPropIds.has(property.prop_id)) {
                    nearbyProperties.push(property);
                    addedPropIds.add(property.prop_id);
                }
            }
        }
        // ==========================================
        // 3. SAME STATE
        // ==========================================
        if (nearbyProperties.length < 6 && state) {
            const stateProperties = await getProperties("state", state);
            for (const property of stateProperties) {
                if (nearbyProperties.length >= 6) {
                    break;
                }
                if (!addedPropIds.has(property.prop_id)) {
                    nearbyProperties.push(property);
                    addedPropIds.add(property.prop_id);
                }
            }
        }
        // ==========================================
        // 4. SAME COUNTRY
        // ==========================================
        if (nearbyProperties.length < 6 && country) {
            const countryProperties = await getProperties("country", country);
            for (const property of countryProperties) {
                if (nearbyProperties.length >= 6) {
                    break;
                }
                if (!addedPropIds.has(property.prop_id)) {
                    nearbyProperties.push(property);
                    addedPropIds.add(property.prop_id);
                }
            }
        }
        // ==========================================
        // GET DETAILS
        // ==========================================
        const propertiesWithDetails = await Promise.all(nearbyProperties.map(async (property) => {
            const [media, amenities, highlights] = await Promise.all([
                this.getPropertyCover(property.prop_id),
                this.getPropOneAmenity(property.prop_id),
                this.getPropertyOneHigh(property.prop_id),
            ]);
            return {
                ...property,
                cover_image: media,
                amenities,
                highlights,
            };
        }));
        return propertiesWithDetails;
    }
}
exports.FormModule = FormModule;

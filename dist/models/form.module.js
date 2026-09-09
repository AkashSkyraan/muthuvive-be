"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormModule = void 0;
const helper_1 = require("../utils/helper");
class FormModule {
    static async createPropertyStep1(category, sub_category, country, state, district, city, user_id) {
        const result = await (0, helper_1.executeQuery)(`
      INSERT INTO prop_form (
        category,
        sub_category,
        country,
        state,
        district,
        city,
        user_id,
        step,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'active')
      `, [category, sub_category, country, state, district, city, user_id]);
        return {
            id: result.insertId,
            step: 1,
        };
    }
    static async updatePropertyStep2(prop_id, data) {
        return await (0, helper_1.executeQuery)(`
      UPDATE prop_form
      SET
        prop_name = ?,
        prop_area = ?,
        area_unit = ?,
        road_plan = ?,
        road_length = ?,
        road_length_unit = ?,
        pathway = ?,
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
        current_step = 2
      WHERE id = ?
      `, [
            data.prop_name ?? null,
            data.prop_area ?? null,
            data.area_unit ?? null,
            data.road_plan ?? null,
            data.road_length ?? null,
            data.road_length_unit ?? null,
            data.pathway ?? null,
            data.length ?? null,
            data.length_unit ?? null,
            data.width ?? null,
            data.width_unit ?? null,
            data.c_well ?? null,
            data.i_well ?? null,
            data.electricity ?? 0,
            data.hp ?? null,
            data.facing ?? null,
            data.construct ?? 0,
            data.construct_type ?? null,
            data.other_type ?? null,
            prop_id,
        ]);
    }
}
exports.FormModule = FormModule;

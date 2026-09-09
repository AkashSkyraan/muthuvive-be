import { executeQuery } from "../utils/helper";

export class FormModule {
  static async createPropertyStep1(
    category: number,
    sub_category: number,
    country: string,
    state: string,
    district: string,
    city: string,
    user_id: number,
  ) {
    const result: any = await executeQuery(
      `
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
      `,
      [category, sub_category, country, state, district, city, user_id],
    );

    return {
      id: result.insertId,
      step: 1,
    };
  }

  static async updatePropertyStep2(
    prop_id: number,
    data: {
      prop_name?: string;
      prop_area?: number;
      area_unit?: string;
      road_plan?: string;
      road_length?: number;
      road_length_unit?: string;
      pathway?: number;
      length?: number;
      length_unit?: string;
      width?: number;
      width_unit?: string;
      c_well?: number;
      i_well?: number;
      electricity?: number;
      hp?: number;
      facing?: number;
      construct?: number;
      construct_type?: number;
      other_type?: string;
    },
  ) {
    return await executeQuery(
      `
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
      `,
      [
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
      ],
    );
  }
}

import { getSupabaseAdmin } from '../config/supabase.js';

export interface IRequiredSkill {
  skill: string;
  importance: 'required' | 'preferred' | 'nice_to_have';
  proficiencyLevel: number;
}

export interface IPersonalityFit {
  dimension: string;
  idealRange: [number, number];
  weight: number;
}

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface IResource {
  type: 'course' | 'article' | 'certification';
  title: string;
  url: string;
}

export interface ICareer {
  id: string;
  title: string;
  description: string;
  category: string;
  required_skills: IRequiredSkill[];
  personality_fit: IPersonalityFit[];
  salary_range: ISalaryRange | null;
  growth_outlook: 'high' | 'medium' | 'low';
  related_careers: string[];
  resources: IResource[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICareerSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  growthOutlook: string;
  requiredSkillsCount: number;
}

export function toCareerSummary(career: ICareer): ICareerSummary {
  return {
    id: career.id,
    title: career.title,
    description: career.description,
    category: career.category,
    growthOutlook: career.growth_outlook,
    requiredSkillsCount: career.required_skills.length,
  };
}

export class CareerRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  async findAll(activeOnly = true): Promise<ICareer[]> {
    let query = this.db
      .from('careers')
      .select('*')
      .order('title', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as ICareer[];
  }

  async findFiltered(options: {
    category?: string;
    search?: string;
    recommended_streams?: string[];
    education_levels?: string[];
    is_student_friendly?: boolean;
    activeOnly?: boolean;
  }): Promise<ICareer[]> {
    const {
      category,
      search,
      recommended_streams,
      education_levels,
      is_student_friendly,
      activeOnly = true,
    } = options;

    let query: any = this.db.from('careers').select('*').order('title', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (typeof is_student_friendly === 'boolean') {
      query = query.eq('is_student_friendly', is_student_friendly);
    }

    // For array fields, use overlap (any match) if provided
    if (recommended_streams && recommended_streams.length > 0) {
      query = query.overlaps('recommended_streams', recommended_streams);
    }

    if (education_levels && education_levels.length > 0) {
      query = query.overlaps('education_levels', education_levels);
    }

    if (search) {
      // Search across title/description/category
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;
    return (data || []) as ICareer[];
  }

  async findById(id: string): Promise<ICareer | null> {
    const { data, error } = await this.db
      .from('careers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as ICareer;
  }

  async findByCategory(category: string): Promise<ICareer[]> {
    const { data, error } = await this.db
      .from('careers')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) throw error;
    return (data || []) as ICareer[];
  }

  async findByIds(ids: string[]): Promise<ICareer[]> {
    if (ids.length === 0) return [];

    const { data, error } = await this.db
      .from('careers')
      .select('*')
      .in('id', ids)
      .eq('is_active', true);

    if (error) throw error;
    return (data || []) as ICareer[];
  }

  async getCategories(): Promise<string[]> {
    const { data, error } = await this.db
      .from('careers')
      .select('category')
      .eq('is_active', true);

    if (error) throw error;

    const categories = [...new Set((data || []).map((c) => c.category))];
    return categories.sort();
  }

  async search(query: string): Promise<ICareer[]> {
    const { data, error } = await this.db
      .from('careers')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('title', { ascending: true })
      .limit(20);

    if (error) throw error;
    return (data || []) as ICareer[];
  }

  async create(career: Omit<ICareer, 'id' | 'created_at' | 'updated_at'>): Promise<ICareer> {
    const { data, error } = await this.db
      .from('careers')
      .insert(career)
      .select()
      .single();

    if (error) throw error;
    return data as ICareer;
  }

  async update(id: string, updates: Partial<ICareer>): Promise<ICareer | null> {
    const { data, error } = await this.db
      .from('careers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as ICareer;
  }
}

export const careerRepository = new CareerRepository();

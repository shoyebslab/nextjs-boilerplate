import apiClient from "@/lib/axios/api-client";

export interface TopbarData {
  id?: number;
  hotline: string;
  phone_display: string;
  ambulance: string;
  email: string;
  address_bn: string;
  address_en: string;
  announcement_bn: string;
  announcement_en: string;
  facebook_url?: string;
  youtube_url?: string;
  portal_link?: string;
}

export interface NavbarItemData {
  id?: number;
  title_bn: string;
  title_en: string;
  href: string;
  order: number;
  is_active: boolean;
  is_external: boolean;
  is_button?: boolean;
}

export interface SliderSlideData {
  id?: number;
  desktop_image: string;
  mobile_image?: string;
  title_bn: string;
  title_en: string;
  subtitle_bn?: string;
  subtitle_en?: string;
  button_text_bn?: string;
  button_text_en?: string;
  button_link?: string;
  order: number;
  is_active: boolean;
}

export interface DepartmentData {
  id?: number;
  name_bn: string;
  name_en: string;
  subtitle_bn?: string;
  subtitle_en?: string;
  description_bn?: string;
  description_en?: string;
  icon_name: string;
  doctor_count: number;
  dept_url: string;
  order: number;
  is_active: boolean;
}

export interface DoctorData {
  id?: number;
  name_bn: string;
  name_en: string;
  specialization_bn: string;
  specialization_en: string;
  qualification_bn?: string;
  qualification_en?: string;
  institute_bn?: string;
  institute_en?: string;
  bmdc_number?: string;
  image_path: string;
  department_name?: string;
  profile_url?: string;
  order: number;
  is_active: boolean;
}

export interface ClinicalFacilityData {
  id?: number;
  title_bn: string;
  title_en: string;
  subtitle_bn?: string;
  subtitle_en?: string;
  description_bn?: string;
  description_en?: string;
  icon_name: string;
  read_more_url: string;
  order: number;
  is_active: boolean;
}

export interface HealthPackageData {
  id?: number;
  name_bn: string;
  name_en: string;
  target_audience_bn: string;
  target_audience_en: string;
  original_price: number;
  discounted_price: number;
  is_popular: boolean;
  features_list_bn: string[];
  features_list_en: string[];
  details_url: string;
  order: number;
  is_active: boolean;
}

export interface HealthCardNoticeData {
  id?: number;
  badge_text_bn: string;
  badge_text_en: string;
  title_bn: string;
  title_en: string;
  subtitle_bn: string;
  subtitle_en: string;
  verify_url: string;
  benefits_url: string;
  is_active: boolean;
}

export interface NewsBlogItemData {
  id?: number;
  item_type: "blog" | "news";
  category: string;
  title_bn: string;
  title_en: string;
  summary_bn?: string;
  summary_en?: string;
  published_date: string;
  slug: string;
  order: number;
  is_active: boolean;
}

export interface CombinedSettingsResponse {
  topbar: TopbarData;
  navbar: NavbarItemData[];
  slides: SliderSlideData[];
  departments: DepartmentData[];
  doctors: DoctorData[];
  facilities: ClinicalFacilityData[];
  packages: HealthPackageData[];
  health_card: HealthCardNoticeData;
  blogs: NewsBlogItemData[];
  news: NewsBlogItemData[];
}

export const settingsApi = {
  async getCombinedSettings(): Promise<CombinedSettingsResponse> {
    const res = await apiClient.get<CombinedSettingsResponse>("/settings/all/");
    return res.data;
  },

  // Topbar
  async getTopbar(): Promise<TopbarData> {
    const res = await apiClient.get<TopbarData>("/settings/topbar/");
    return res.data;
  },
  async updateTopbar(data: Partial<TopbarData>): Promise<TopbarData> {
    const res = await apiClient.put<TopbarData>("/settings/topbar/", data);
    return res.data;
  },

  // Navbar
  async getNavbarItems(): Promise<NavbarItemData[]> {
    const res = await apiClient.get<NavbarItemData[]>("/settings/navbar/");
    return res.data;
  },
  async createNavbarItem(data: Omit<NavbarItemData, "id">): Promise<NavbarItemData> {
    const res = await apiClient.post<NavbarItemData>("/settings/navbar/", data);
    return res.data;
  },
  async updateNavbarItem(id: number, data: Partial<NavbarItemData>): Promise<NavbarItemData> {
    const res = await apiClient.put<NavbarItemData>(`/settings/navbar/${id}/`, data);
    return res.data;
  },
  async deleteNavbarItem(id: number): Promise<void> {
    await apiClient.delete(`/settings/navbar/${id}/`);
  },

  // Slider Slides
  async getSlides(): Promise<SliderSlideData[]> {
    const res = await apiClient.get<SliderSlideData[]>("/settings/slider/");
    return res.data;
  },
  async createSlide(data: Omit<SliderSlideData, "id">): Promise<SliderSlideData> {
    const res = await apiClient.post<SliderSlideData>("/settings/slider/", data);
    return res.data;
  },
  async updateSlide(id: number, data: Partial<SliderSlideData>): Promise<SliderSlideData> {
    const res = await apiClient.put<SliderSlideData>(`/settings/slider/${id}/`, data);
    return res.data;
  },
  async deleteSlide(id: number): Promise<void> {
    await apiClient.delete(`/settings/slider/${id}/`);
  },

  // Departments
  async getDepartments(): Promise<DepartmentData[]> {
    const res = await apiClient.get<DepartmentData[]>("/settings/departments/");
    return res.data;
  },
  async createDepartment(data: Omit<DepartmentData, "id">): Promise<DepartmentData> {
    const res = await apiClient.post<DepartmentData>("/settings/departments/", data);
    return res.data;
  },
  async updateDepartment(id: number, data: Partial<DepartmentData>): Promise<DepartmentData> {
    const res = await apiClient.put<DepartmentData>(`/settings/departments/${id}/`, data);
    return res.data;
  },
  async deleteDepartment(id: number): Promise<void> {
    await apiClient.delete(`/settings/departments/${id}/`);
  },

  // Doctors
  async getDoctors(): Promise<DoctorData[]> {
    const res = await apiClient.get<DoctorData[]>("/settings/doctors/");
    return res.data;
  },
  async createDoctor(data: Omit<DoctorData, "id">): Promise<DoctorData> {
    const res = await apiClient.post<DoctorData>("/settings/doctors/", data);
    return res.data;
  },
  async updateDoctor(id: number, data: Partial<DoctorData>): Promise<DoctorData> {
    const res = await apiClient.put<DoctorData>(`/settings/doctors/${id}/`, data);
    return res.data;
  },
  async deleteDoctor(id: number): Promise<void> {
    await apiClient.delete(`/settings/doctors/${id}/`);
  },

  // Clinical Facilities
  async getFacilities(): Promise<ClinicalFacilityData[]> {
    const res = await apiClient.get<ClinicalFacilityData[]>("/settings/facilities/");
    return res.data;
  },
  async createFacility(data: Omit<ClinicalFacilityData, "id">): Promise<ClinicalFacilityData> {
    const res = await apiClient.post<ClinicalFacilityData>("/settings/facilities/", data);
    return res.data;
  },
  async updateFacility(id: number, data: Partial<ClinicalFacilityData>): Promise<ClinicalFacilityData> {
    const res = await apiClient.put<ClinicalFacilityData>(`/settings/facilities/${id}/`, data);
    return res.data;
  },
  async deleteFacility(id: number): Promise<void> {
    await apiClient.delete(`/settings/facilities/${id}/`);
  },

  // Health Packages
  async getPackages(): Promise<HealthPackageData[]> {
    const res = await apiClient.get<HealthPackageData[]>("/settings/packages/");
    return res.data;
  },
  async createPackage(data: Omit<HealthPackageData, "id">): Promise<HealthPackageData> {
    const res = await apiClient.post<HealthPackageData>("/settings/packages/", data);
    return res.data;
  },
  async updatePackage(id: number, data: Partial<HealthPackageData>): Promise<HealthPackageData> {
    const res = await apiClient.put<HealthPackageData>(`/settings/packages/${id}/`, data);
    return res.data;
  },
  async deletePackage(id: number): Promise<void> {
    await apiClient.delete(`/settings/packages/${id}/`);
  },

  // Health Card
  async getHealthCard(): Promise<HealthCardNoticeData> {
    const res = await apiClient.get<HealthCardNoticeData>("/settings/health-card/");
    return res.data;
  },
  async updateHealthCard(data: Partial<HealthCardNoticeData>): Promise<HealthCardNoticeData> {
    const res = await apiClient.put<HealthCardNoticeData>("/settings/health-card/", data);
    return res.data;
  },

  // News & Blogs
  async getNewsBlogs(): Promise<NewsBlogItemData[]> {
    const res = await apiClient.get<NewsBlogItemData[]>("/settings/news-blogs/");
    return res.data;
  },
  async createNewsBlog(data: Omit<NewsBlogItemData, "id">): Promise<NewsBlogItemData> {
    const res = await apiClient.post<NewsBlogItemData>("/settings/news-blogs/", data);
    return res.data;
  },
  async updateNewsBlog(id: number, data: Partial<NewsBlogItemData>): Promise<NewsBlogItemData> {
    const res = await apiClient.put<NewsBlogItemData>(`/settings/news-blogs/${id}/`, data);
    return res.data;
  },
  async deleteNewsBlog(id: number): Promise<void> {
    await apiClient.delete(`/settings/news-blogs/${id}/`);
  },
};

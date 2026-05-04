
export interface Message {
  id?: number;
  created_at?: string;
  name: string;
  email: string;
  message: string;
}

export interface Capability {
  id?: number;
  created_at?: string;
  title: string;
  image_url: string;
  description: string;
}

export interface Settings {
  id?: number;
  key: string;
  value: string;
}

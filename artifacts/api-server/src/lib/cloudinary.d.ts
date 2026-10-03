declare module "cloudinary" {
  export interface ConfigOptions {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
    secure?: boolean;
    [key: string]: any;
  }

  export interface UploadApiResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder?: string;
    original_filename?: string;
    [key: string]: any;
  }

  export interface UploadApiOptions {
    folder?: string;
    public_id?: string;
    resource_type?: string;
    overwrite?: boolean;
    [key: string]: any;
  }

  export const v2: {
    config: (options: ConfigOptions) => any;
    uploader: {
      upload: (file: string, options?: UploadApiOptions) => Promise<UploadApiResponse>;
      destroy: (public_id: string, options?: any) => Promise<any>;
      [key: string]: any;
    };
    [key: string]: any;
  };

  export default { v2 };
}

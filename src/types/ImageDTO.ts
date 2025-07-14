export interface CreateMetaDTO {
  size: number;
  mime: string;        
  tags: number[];
}

export interface PresignResponse {
  imageId: string;
  presignedUrl: string;
  key: string;
}

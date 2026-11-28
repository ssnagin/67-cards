export type ContentBlockType = 'text' | 'image' | 'table'

export type ContentBlock = {
  type: ContentBlockType
  content?: string   // для text
  fileId?: string    // для image (GridFS/S3 key)
  url?: string       // альтернатива fileId
  data?: unknown     // для table и прочих структур
}

export type CardSide = {
  blocks: ContentBlock[]
}

export type Card = {
  id: string
  deckId: string
  front: CardSide
  back: CardSide
}
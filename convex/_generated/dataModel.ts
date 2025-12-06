/* eslint-disable */
/**
 * Generated Convex data model stub - will be replaced when running `npx convex dev`
 */

// Generic ID type that will be replaced by real Convex ID
export type Id<TableName extends string> = string & { __tableName: TableName };

// Document types stub
export type Doc<TableName extends string> = {
  _id: Id<TableName>;
  _creationTime: number;
};

// Data model type
export type DataModel = {
  products: any;
  alerts: any;
  userSettings: any;
};

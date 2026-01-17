import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import crypto from 'crypto';

// RefreshToken document interface
export interface IRefreshToken {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// RefreshToken document
export interface IRefreshTokenDocument extends IRefreshToken, Document {}

// RefreshToken model interface
export interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {
  generateToken(): string;
  findValidToken(token: string): Promise<IRefreshTokenDocument | null>;
  revokeAllForUser(userId: Types.ObjectId): Promise<void>;
}

const refreshTokenSchema = new Schema<IRefreshTokenDocument, IRefreshTokenModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// TTL index to automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate a secure random token
refreshTokenSchema.statics.generateToken = function (): string {
  return crypto.randomBytes(64).toString('hex');
};

// Static method to find a valid (non-expired) token
refreshTokenSchema.statics.findValidToken = function (
  token: string
): Promise<IRefreshTokenDocument | null> {
  return this.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
};

// Static method to revoke all tokens for a user (logout from all devices)
refreshTokenSchema.statics.revokeAllForUser = async function (
  userId: Types.ObjectId
): Promise<void> {
  await this.deleteMany({ userId });
};

export const RefreshToken = mongoose.model<
  IRefreshTokenDocument,
  IRefreshTokenModel
>('RefreshToken', refreshTokenSchema);

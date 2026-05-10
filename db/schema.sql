CREATE TABLE IF NOT EXISTS social_network_app_1778416014583_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT DEFAULT '',
  profile_picture VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_network_app_1778416014583_posts (
  post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES social_network_app_1778416014583_users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_network_app_1778416014583_comments (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_network_app_1778416014583_posts(post_id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES social_network_app_1778416014583_users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_network_app_1778416014583_likes (
  like_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_network_app_1778416014583_posts(post_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES social_network_app_1778416014583_users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS social_network_app_1778416014583_connections (
  connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES social_network_app_1778416014583_users(user_id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES social_network_app_1778416014583_users(user_id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (user_id_1 != user_id_2)
);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON social_network_app_1778416014583_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON social_network_app_1778416014583_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON social_network_app_1778416014583_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON social_network_app_1778416014583_comments(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON social_network_app_1778416014583_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_connections_user_id_1 ON social_network_app_1778416014583_connections(user_id_1);
CREATE INDEX IF NOT EXISTS idx_connections_user_id_2 ON social_network_app_1778416014583_connections(user_id_2);
CREATE INDEX IF NOT EXISTS idx_connections_status ON social_network_app_1778416014583_connections(status);

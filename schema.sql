-- CareerPowers Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assessments table - stores completed MBTI assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    responses JSONB NOT NULL,
    mbti_type VARCHAR(4) NOT NULL,
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    superpower_title VARCHAR(255) NOT NULL,
    superpower_data JSONB NOT NULL,
    ai_analysis JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    shared_count INTEGER DEFAULT 0,
    ip_address INET
);

-- Email subscribers table - stores email signups
CREATE TABLE email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source VARCHAR(100) DEFAULT 'assessment',
    metadata JSONB
);

-- Analytics events table - stores user interactions for analysis
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_assessments_mbti_type ON assessments(mbti_type);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
CREATE INDEX idx_assessments_email ON assessments(email);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to assessments table
CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to assessments (for sharing results)
CREATE POLICY "Allow public read on assessments" ON assessments
    FOR SELECT USING (true);

-- Allow public insert on assessments (for taking the quiz)
CREATE POLICY "Allow public insert on assessments" ON assessments
    FOR INSERT WITH CHECK (true);

-- Allow public insert on email_subscribers (for email capture)
CREATE POLICY "Allow public insert on email_subscribers" ON email_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow public insert on analytics_events (for tracking)
CREATE POLICY "Allow public insert on analytics_events" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Functions for common operations

-- Function to get assessment by ID
CREATE OR REPLACE FUNCTION get_assessment(assessment_id UUID)
RETURNS TABLE (
    id UUID,
    mbti_type VARCHAR(4),
    superpower_title VARCHAR(255),
    superpower_data JSONB,
    ai_analysis JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    shared_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.mbti_type,
        a.superpower_title,
        a.superpower_data,
        a.ai_analysis,
        a.completed_at,
        a.shared_count
    FROM assessments a
    WHERE a.id = assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(assessment_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE assessments 
    SET shared_count = shared_count + 1 
    WHERE id = assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
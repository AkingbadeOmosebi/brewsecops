# RDS Module - Creates PostgreSQL RDS instance
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db-${var.environment}"
  engine         = "postgres"
  engine_version = var.postgres_version

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = var.storage_type
  storage_encrypted = true

  # Pointing to the KMS key defined below in this same file
  kms_key_id = aws_kms_key.brew_key.arn

  db_name  = var.database_name
  username = var.master_username
  password = var.master_password
  port     = 5432

  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = var.db_subnet_group_name

  multi_az            = var.multi_az
  publicly_accessible = false
  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot

  # snapshot logic
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project_name}-db-final-snapshot-${var.environment}-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  #  backup/maintenance windows
  backup_retention_period = var.backup_retention_period
  backup_window           = var.backup_window
  maintenance_window      = var.maintenance_window

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name        = "${var.project_name}-db-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# KMS Key for encryption
resource "aws_kms_key" "brew_key" {
  deletion_window_in_days = var.kms_deletion_window
  enable_key_rotation     = true
}
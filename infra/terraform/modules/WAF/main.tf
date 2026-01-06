# WAF Module - Enhanced with CAPTCHA, Bot Control, and Geographic Blocking
# This module creates a comprehensive Web Application Firewall for your ALB

data "aws_caller_identity" "current" {}

resource "aws_wafv2_web_acl" "main" {
  name  = "${var.project_name}-waf-${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }


  # RULE 1: Rate Limiting with CAPTCHA Challenge
  # Purpose: Prevent DDoS attacks and brute force attempts
  # How it works:
    #  Tracks requests per IP address
    #  If IP exceeds limit in 5 min window → CAPTCHA or BLOCK
    #  CAPTCHA: Shows puzzle, legitimate users solve and continue
    #  BLOCK: Immediately rejects request (old behavior)
  rule {
    name     = "RateLimitRule"
    priority = 1

    action {
      # If CAPTCHA enabled: shows challenge instead of blocking
      dynamic "challenge" {
        for_each = var.captcha_on_rate_limit ? [1] : []
        content {
          # Browser receives challenge, user solves CAPTCHA
          # On success, browser retries request with token
        }
      }

      # If CAPTCHA disabled: just block the request
      dynamic "block" {
        for_each = !var.captcha_on_rate_limit ? [1] : []
        content {}
      }
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit          # requests per 5 min
        aggregate_key_type = "IP"                    # track by IP address
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-rate-limit-${var.environment}"
      sampled_requests_enabled   = true
    }
  }

 
  # RULE 2: AWS Core Rule Set 
    # Protection against: XSS, SQL injection, RCE, CSRF, XXE, etc.
    # Maintained by AWS and updated regularly
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}  # Uses rule group's default actions
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-common-rules-${var.environment}"
      sampled_requests_enabled   = true
    }
  }

 
  # RULE 3: Known Bad Inputs 
    # Blocks: Log4j exploits, known malware, scanner signatures
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-bad-inputs-${var.environment}"
      sampled_requests_enabled   = true
    }
  }

 
  # RULE 4: SQL Injection Protection 
  # Dedicated rule for SQL injection detection
  # Catches: UNION SELECT, DROP TABLE, comment injection, etc.
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-sqli-rules-${var.environment}"
      sampled_requests_enabled   = true
    }
  }

 
  # RULE 5: IP Whitelist (Optional, Tested on known IPs)
    # Purpose: Allow specific IPs to bypass WAF rules entirely
    # Use case: Internal IPs, partner APIs, monitoring services
    # Only created if ip_whitelist variable contains IPs
  dynamic "rule" {
    for_each = length(var.ip_whitelist) > 0 ? [1] : []

    content {
      name     = "IPWhitelistRule"
      priority = 5

      action {
        allow {}  # These IPs skip all other rules
      }

      statement {
        ip_set_reference_statement {
          arn = aws_wafv2_ip_set.whitelist[0].arn
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project_name}-ip-whitelist-${var.environment}"
        sampled_requests_enabled   = true
      }
    }
  }

 
  # RULE 6: Geographic Blocking 
    # Purpose: Block requests from specific countries
    # Use case: Compliance, regional restrictions, threat mitigation
    # Example: blocked_countries = ["CN", "RU", "KP"]
    # Only created if enable_geo_blocking is true AND countries list provided
  dynamic "rule" {
    for_each = var.enable_geo_blocking && length(var.blocked_countries) > 0 ? [1] : []

    content {
      name     = "GeographicBlockingRule"
      priority = 6

      action {
        block {}  # Reject requests from these countries
      }

      statement {
        geo_match_statement {
          country_codes = var.blocked_countries
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project_name}-geo-block-${var.environment}"
        sampled_requests_enabled   = true
      }
    }
  }

 
  # RULE 7: Bot Control (AWS Managed)
 
  # Purpose: Detect and challenge automated requests
        # Detects:
        #   - Browser automation (Selenium, Puppeteer)
        #   - Web scrapers
        #   - Vulnerability scanners
        #   - DDoS tools
        #   - API abuse
  
  # Action: CHALLENGE (show CAPTCHA) by default
  # Uses machine learning to distinguish humans from bots
  rule {
    name     = "AWSManagedRulesBotControlRuleSet"
    priority = 7

    override_action {
      none {}  # Uses AWS default: Challenge bots
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-bot-control-${var.environment}"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-waf-${var.environment}"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "${var.project_name}-waf-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# IP SET - Whitelist
  # Resource for managing whitelisted IPs
  # Only created if ip_whitelist variable is not empty
resource "aws_wafv2_ip_set" "whitelist" {
  count = length(var.ip_whitelist) > 0 ? 1 : 0

  name               = "${var.project_name}-ip-whitelist-${var.environment}"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"
  addresses          = var.ip_whitelist

  tags = {
    Name        = "${var.project_name}-ip-whitelist-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# WAF ASSOCIATION WITH ALB
  # Links the Web ACL to your Application Load Balancer
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = var.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.main.arn
}

# CLOUDWATCH LOG GROUP
  # Stores all WAF logs: blocked requests, CAPTCHA challenges, etc.
resource "aws_cloudwatch_log_group" "waf" {
  name              = "aws-waf-logs-${var.project_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-waf-logs-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# WAF LOGGING CONFIGURATION
    # Enables logging of all WAF actions to CloudWatch
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  resource_arn            = aws_wafv2_web_acl.main.arn
  log_destination_configs = ["${aws_cloudwatch_log_group.waf.arn}:*"]

  # Logging is essential for:
    # - Monitoring attacks
    # - Setting up alarms
    # - Compliance and auditing
    # - Debugging false positives
  }

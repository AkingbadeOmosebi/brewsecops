resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1b511abead59c6ce207077c0ef0285d4d2486cfb"
  ]

  tags = {
    Name        = "github-oidc"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "github_actions" {
  name               = "github-actions-${var.project_name}-role"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json

  tags = {
    Name        = "github-actions-role"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "aws_iam_policy_document" "github_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/main",
        "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/develop",
        "repo:${var.github_org}/${var.github_repo}:environment:${var.environment}"
      ]
    }
  }
}

resource "aws_iam_role_policy" "terraform" {
  name   = "github-actions-terraform"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.terraform.json
}

data "aws_iam_policy_document" "terraform" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetBucketVersioning"
    ]
    resources = [
      "arn:aws:s3:::brewsecops-terraform-state-*",
      "arn:aws:s3:::brewsecops-terraform-state-*/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]
    resources = ["arn:aws:dynamodb:*:*:table/brewsecops-terraform-locks"]
  }

  statement {
    effect = "Allow"
    actions = [
      "ec2:*",
      "ecs:*",
      "rds:*",
      "ecr:*",
      "elasticloadbalancing:*",
      "iam:*",
      "wafv2:*",
      "route53:*",
      "acm:*",
      "logs:*",
      "cloudwatch:*",
      "kms:*",
      "application-autoscaling:*"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ecr" {
  name   = "github-actions-ecr"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.ecr.json
}

data "aws_iam_policy_document" "ecr" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload"
    ]
    resources = ["arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/brewsecops-*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ecs" {
  name   = "github-actions-ecs"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.ecs.json
}

data "aws_iam_policy_document" "ecs" {
  statement {
    effect = "Allow"
    actions = [
      "ecs:UpdateService",
      "ecs:DescribeServices",
      "ecs:DescribeTaskDefinition",
      "ecs:DescribeClusters",
      "ecs:ListClusters"
    ]
    resources = [
      "arn:aws:ecs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:cluster/brewsecops-*",
      "arn:aws:ecs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:service/brewsecops-*/*"
    ]
  }

  statement {
    effect    = "Allow"
    actions   = ["iam:PassRole"]
    resources = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/*"]
  }
}


# Policy for Secrets Manager
resource "aws_iam_role_policy" "secrets_manager" {
  name   = "github-actions-secrets-manager"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.secrets_manager.json
}

data "aws_iam_policy_document" "secrets_manager" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue"
    ]
    resources = [
      "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:brewsecops/*"
    ]
  }
}
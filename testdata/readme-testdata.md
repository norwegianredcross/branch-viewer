# Test Data Generator

This directory contains tools for generating anonymized test data for the Red Cross Organizations API.

## Setup

```bash
cd testdata
npm install
```

## Usage

To generate anonymized test data:

```bash
npm run generate
```

This script will:
1. Read data from `../secrets/organizations.json`
2. Anonymize sensitive information (names, emails, phone numbers)
3. Create `organizations.json` in this directory with the anonymized data

## What gets anonymized

- Contact names (using Norwegian-style names)
- Email addresses (format: firstname.lastname@rodekors.org)
- Phone numbers (format: +47 XXXXXXXX)

All other data remains unchanged, including:
- Branch IDs and organization numbers
- Addresses and locations
- Dates and status information
- Role information
- Organizational structure

## Note

The `secrets` directory containing real data should be in your `.gitignore` to prevent accidental commits of sensitive information.
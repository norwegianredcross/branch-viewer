# Branch Viewer

This component displays Norwegian Red Cross branch hierarchy information from an API endpoint. It shows the organizational structure from main office through districts down to local branches (lokalforeninger).

## Purpose
The Branch Viewer is designed to be embedded into any webpage, providing a consistent way to display Red Cross organizational structure. It shows branch details including:
- Branch hierarchy (main office -> district -> local branch)
- Contact information
- Address details
- Status information

## Technical Implementation

### Core Technologies
- React 18+ with TypeScript for robust development
- shadcn/ui for pre-built, accessible UI components
- Tailwind CSS for styling
- Lodash for efficient data manipulation

### UI Components
We use shadcn/ui components for a consistent, accessible interface:
- Collapsible: For expandable/collapsible branch view
- Card: For displaying branch information
- Sheet: For mobile-friendly detailed views

### Build & Development Tools
- Vite for fast development and optimized builds
- TypeScript for type safety
- PostCSS for CSS processing
- ESLint and Prettier for code quality

## Usage
To include the Branch Viewer in a webpage, add these two lines:

```html
<!-- Branch Viewer styles -->
<link rel="stylesheet" href="https://norwegianredcross.github.io/branch-viewer/dist/branch-viewer.css">

<!-- Branch Viewer script -->
<script src="https://norwegianredcross.github.io/branch-viewer/dist/branch-viewer.js"></script>

<!-- The component will render here -->
<div id="rc-branch-viewer"></div>
```

## API Integration

The component integrates with the Red Cross Organizations API v1.0.0. This API provides detailed information about branches, including branch details, organizational hierarchy, contact information, and geographic location.

### API Endpoints
- Base URL: `https://api.redcross.no`
- Endpoint: `/v1/organizations`
- Authentication: Bearer token required

### Response Format Example
```json
{
  "data": {
    "branches": [{
      "branchId": "L098",
      "branchNumber": "0600069",
      "type": "Lokalforening",
      "branchName": "Modum Røde Kors",
      "status": {
        "isActive": true,
        "creationDate": "1914-10-16",
        "terminationDate": null,
        "isTerminated": false
      },
      "parent": {
        "branchId": "D006",
        "branchNumber": "0609906",
        "branchName": "Buskerud Røde Kors",
        "type": "Distrikt"
      }
    }]
  },
  "metadata": {
    "totalCount": 384,
    "timestamp": "2024-12-13T02:44:12Z"
  }
}
```

### Data Structures

#### Branch Information
Each branch contains:
- `branchId`: Unique identifier (e.g., "L098")
- `branchNumber`: Organization number (e.g., "0600069")
- `type`: Either "Lokalforening" or "Distrikt"
- `branchName`: Name of the branch
- `status`: Activity status including:
  - Creation date
  - Termination date (if applicable)
  - Active status

#### Hierarchical Structure
Branches are organized hierarchically:
- Parent organization details
  - Parent branchId
  - Parent name
  - Parent type

#### Contact Information
- Multiple contacts per branch
- Roles (Leder, Nestleder)
- Contact details:
  - Name
  - Email
  - Phone (Norwegian format)
  - Volunteer/Member status

#### Address Information
Supports multiple address types:
- Postal address
- Visiting address
- Municipality and region details
- Norwegian postal code format

#### Communication Channels
- Phone numbers (Norwegian format: "+47 90056438")
- Email addresses
- Website URLs

### Error Handling
The API returns standard HTTP status codes:
- 200: Successful response
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

Error responses include:
- Error message
- Error code
- Additional details when available

## Development

### Setup
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Project Structure
```
branch-viewer/
├── src/                    # React + TypeScript development files
│   ├── components/         # React components
│   │   ├── BranchTree/    # Tree view components
│   │   └── shared/        # Shared components
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript definitions
│   └── styles/            # CSS and Tailwind styles
├── dist/                   # Built files for distribution
│   ├── branch-viewer.js    # Standalone bundled JS
│   └── branch-viewer.css   # Standalone bundled CSS
└── public/                 # Static files for development
```

### Type Definitions
The project includes TypeScript definitions generated from the OpenAPI specification, ensuring type safety and accurate API integration. Key types include:

```typescript
interface Branch {
  branchId: string;
  branchNumber: string;
  type: "Lokalforening" | "Distrikt";
  branchName: string;
  status: BranchStatus;
  parent?: ParentOrganization;
  contacts: Contact[];
  addresses: AddressInfo;
}

interface BranchStatus {
  isActive: boolean;
  creationDate: string;
  terminationDate: string | null;
  isTerminated: boolean;
}

interface Contact {
  role: "Leder" | "Nestleder";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  isVolunteer: boolean;
  isMember: boolean;
}
```

### Data Validation
The component implements validation for:
- Norwegian organization numbers (9 digits)
- Norwegian phone numbers (international format)
- Norwegian postal codes (4 digits)
- Valid email addresses
- URI format for websites

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 is not supported

## Dependencies
- React 18+
- shadcn/ui components
- Tailwind CSS
- Lodash
- TypeScript 5+

## Development Dependencies
- Vite
- PostCSS
- TypeScript
- ESLint
- Prettier

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure you:
- Follow the existing code style
- Add/update tests as needed
- Update documentation as needed
- Follow standard git commit message conventions


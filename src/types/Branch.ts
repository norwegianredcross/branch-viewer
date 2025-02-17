export interface Branch {
  branchId: string;
  branchNumber: string;
  organizationNumber: string;
  branchType: 'Lokalforening' | 'Distrikt';
  branchName: string;
  branchStatus: {
    isActive: boolean;
    creationDate: string;
    terminationDate: string | null;
    isTerminated: boolean;
  };
  parent: {
    branchId: string;
    branchNumber: string;
    branchName: string;
    branchType: 'Lokalforening' | 'Distrikt';
  };
  organizationDetails: {
    description: string;
    organizationLevel: string;
  };
  addresses: {
    municipality: string | null;
    region: string | null;
    postal: {
      addressLine1: string;
      addressLine2: string | null;
      postalCode: string;
      postOffice: string;
    };
    visiting: any | null;
  };
  communicationChannels: {
    phone: string | null;
    email: string | null;
    web: string | null;
  };
  geometry: any | null;
  branchContacts: Array<{
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    jobTitle: string | null;
    isVolunteer: boolean;
    isMember: boolean;
    memberNumber: string;
  }>;
  branchActivities: string[];
}

export interface BranchResponse {
  data: {
    branches: Branch[];
  };
  metadata: {
    totalCount: number;
    timestamp: string;
  };
} 
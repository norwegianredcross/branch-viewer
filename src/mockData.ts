import organizationsData from '../secrets/organizations.json';
import { BranchResponse } from './types/Branch';

// Type assertion to ensure the data matches our BranchResponse type
export const mockData = organizationsData as BranchResponse; 
import React from 'react';
import { Branch } from '../types/Branch';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp, MapPin, Mail, Phone, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{branch.branchName}</CardTitle>
        <p className="text-muted-foreground">{branch.branchType}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {branch.addresses.postal && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{branch.addresses.postal.addressLine1}</span>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>{isExpanded ? 'Vis mindre' : 'Vis mer'}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        <div className={cn(
          "space-y-4 pt-4 border-t",
          !isExpanded && "hidden"
        )}>
          {branch.branchContacts.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Kontakter</h4>
              <div className="space-y-4">
                {branch.branchContacts.map((contact, index) => (
                  <div key={index} className="space-y-1">
                    <div className="font-semibold">{contact.role}</div>
                    <div>{contact.firstName} {contact.lastName}</div>
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </a>
                    )}
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {branch.branchActivities.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Aktiviteter</h4>
              <ul className="space-y-2">
                {branch.branchActivities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
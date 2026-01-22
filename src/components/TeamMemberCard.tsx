import React from 'react';
import { ClubMember } from '@/types';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface TeamMemberCardProps {
  member: ClubMember;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  size = 'md',
  highlight = false 
}) => {
  return (
    <Card className={`p-4 text-center transition-all duration-300 hover:shadow-lg ${
      highlight ? 'border-primary border-2 bg-primary/5' : ''
    }`}>
      <div className={`${sizeClasses[size]} mx-auto rounded-full bg-muted flex items-center justify-center mb-3 overflow-hidden`}>
        {member.photo ? (
          <img 
            src={member.photo} 
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-1/2 h-1/2 text-muted-foreground" />
        )}
      </div>
      <h4 className="font-semibold text-foreground">{member.name}</h4>
      <p className="text-sm text-muted-foreground">{member.designation}</p>
      {member.isFacultyAdvisor && (
        <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Faculty Advisor
        </span>
      )}
      {member.isPresident && (
        <span className="inline-block mt-2 text-xs bg-club/10 text-club px-2 py-1 rounded-full">
          President
        </span>
      )}
    </Card>
  );
};

export default TeamMemberCard;
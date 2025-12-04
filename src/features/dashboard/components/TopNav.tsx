import React from 'react';
import { Bell, HelpCircle, User as UserIcon } from 'lucide-react';
import { MOCK_DASHBOARD_OVERVIEW } from '../mockData';

const TopNav: React.FC = () => {
  const { operator } = MOCK_DASHBOARD_OVERVIEW;

  return (
    <>
      <div className="aqx-topnav-left">
        <div className="aqx-topnav-logo">
          <img
            src={operator.logoUrl ?? '/operator-logo.png'}
            alt={`${operator.name} logo`}
          />
        </div>
        <div className="aqx-topnav-operator-block">
          <div className="aqx-topnav-label">Operator</div>
          <div className="aqx-topnav-operator-name">{operator.name}</div>
        </div>
      </div>

      <div className="aqx-topnav-actions">
        <button className="aqx-btn-icon" aria-label="Notifications">
          <Bell />
        </button>
        <button className="aqx-btn-icon" aria-label="Help">
          <HelpCircle />
        </button>
        <button className="aqx-btn-primary">
          <UserIcon />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default TopNav;
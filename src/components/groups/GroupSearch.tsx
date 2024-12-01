import React, { useState } from 'react';
import { TodoGroup } from '../../types';
import { useStore } from '../../store/useStore';

export const GroupSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const publicGroups = useStore(state => 
    state.groups.filter(group => group.visibility === 'public')
  );
  const joinGroup = useStore(state => state.joinGroup);
  const user = useStore(state => state.user);

  const filteredGroups = publicGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinGroup = (groupId: string) => {
    if (user) {
      joinGroup(groupId, user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {group.members.length} members
              </span>
              {!group.members.includes(user?.id || '') && (
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
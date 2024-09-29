import React, { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button'; // Assuming you have a Button component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'; // Modal Components
import { useMail } from './chat';
import { useUser } from '@/app/context/userContext';

interface MailItem {
  userId: string;
  name: string;
  doctorName: string;
  doctor_id: string;
  id: string;
  read: boolean;
  date: string;
  labels: string[];
}

interface ChatListProps {
  items: MailItem[];
  sheetState: boolean;
}

const ContactList = ({ items, sheetState }: ChatListProps) => {
  const { role } = useUser();
  const [mail, setMail] = useMail();

  const [randomNumber, setRandomNumber] = useState(0);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [communityMembers, setCommunityMembers] = useState([]); // List of doctor IDs
  const [isCommunityView, setIsCommunityView] = useState(false); // Track whether to show user or community chats

  // Set a random number on component load
  useEffect(() => {
    const number = Math.floor(Math.random() * 11);
    setRandomNumber(number);
  }, [randomNumber]);

  // Handle creating a community
  const handleCreateCommunity = () => {
    console.log('Creating community with:', newCommunityName, communityMembers);
    setIsCreatingCommunity(false);
    // Add logic here to send newCommunityName and communityMembers to your backend API
  };

  // Toggle between user chats and community chats
  const toggleChatView = () => {
    setIsCommunityView(!isCommunityView);
  };

  if (role !== 'DOCTOR') {
    return (
      <div className="h-full w-full">
        {/* Normal chat section for users */}
        <ScrollArea className="h-[calc(100%-64px)]">
          <div className="origin-top-right flex flex-col mt-4 p-3 pt-0">
            {items?.map((item, index) => (
              <button
                key={item.id}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg p-2 text-left text-sm transition-all',
                  mail.selected !== item.id && 'hover:bg-muted',
                  mail.selected === item.id && 'bg-primary'
                )}
                onClick={() =>
                  setMail({
                    ...mail,
                    selected: item.doctor_id,
                    name: item.doctorName
                  })
                }
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        className="rounded-full"
                        src={`https://avatar.iran.liara.run/username?username=${item.doctorName || 'Default Name'}`}
                        alt="@doctor"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className={`flex w-[calc(100%-70px)] ${mail.selected ? '' : 'border-b'} mt-1 gap-2`}>
                      <div>
                        <h3
                          className={cn(
                            'font-medium text-[14px]',
                            mail.selected === item.id ? 'text-white' : 'text-foreground'
                          )}
                        >
                          {item.doctorName || 'User ' + index}
                        </h3>
                      </div>
                      <div
                        className={cn(
                          'ml-auto text-xs flex flex-col items-end gap-1',
                          mail.selected === item.id ? 'text-white' : 'text-muted-foreground'
                        )}
                      >
                        {mail.selected !== item.id && (
                          <span>
                            <Badge className="scale-75">69</Badge>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="w-full h-16 flex items-center justify-center px-4 border-t">
          <Input placeholder="Search name" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full">
        {/* Button to toggle between user chats and community chats */}
        <div className="flex justify-center p-4">
          <Button onClick={toggleChatView}>
            {isCommunityView ? 'Switch to User Chats' : 'Switch to Community Chats'}
          </Button>

        </div>

        {/* Dialog for creating a community */}
        <Dialog open={isCreatingCommunity} onOpenChange={setIsCreatingCommunity}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Community</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="Community Name"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Add members (Doctor IDs)"
                value={communityMembers.join(', ')}
                onChange={(e) => setCommunityMembers(e.target.value.split(','))}
                className="mb-4"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCommunity}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Conditional rendering based on chat view (user or community) */}
        <ScrollArea className="h-[calc(100%-200px)]">
          <div className="origin-top-right flex flex-col mt-4 p-3 pt-0">
            {!isCommunityView ? (
              /* User Chats */
              items?.map((item, index) => (
                <button
                  key={item.id}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-lg p-2 text-left text-sm transition-all',
                    mail.selected !== item.id && 'hover:bg-muted',
                    mail.selected === item.id && 'bg-primary'
                  )}
                  onClick={() =>
                    setMail({
                      ...mail,
                      selected: item.userId,
                      name: item.name
                    })
                  }
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex gap-2">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          className="rounded-full"
                          src={`https://avatar.iran.liara.run/username?username=${item.name || 'Default Name'}`}
                          alt="@doctor"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className={`flex w-[calc(100%-70px)] ${mail.selected ? '' : 'border-b'} mt-1 gap-2`}>
                        <div>
                          <h3
                            className={cn(
                              'font-medium text-[14px]',
                              mail.selected === item.id ? 'text-white' : 'text-foreground'
                            )}
                          >
                            {item.name || 'User ' + index}
                          </h3>
                        </div>
                        <div
                          className={cn(
                            'ml-auto text-xs flex flex-col items-end gap-1',
                            mail.selected === item.id ? 'text-white' : 'text-muted-foreground'
                          )}
                        >
                          {mail.selected !== item.id && (
                            <span>
                              <Badge className="scale-75">69</Badge>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))
           
            ) : (
              /* Community Chats */
              items
                ?.filter((item) => item.labels?.includes('community')) // Assuming 'labels' categorize communities
                .map((community, index) => (
                  <button
                    key={community.id}
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-lg p-2 text-left text-sm transition-all',
                      mail.selected !== community.id && 'hover:bg-muted',
                      mail.selected === community.id && 'bg-primary'
                    )}
                    onClick={() =>
                      setMail({
                        ...mail,
                        selected: community.id,
                        name: community.name
                      })
                    }
                  >
                    <h3>{community.name}</h3>
                  </button>
                ))
            )}
          </div>
        </ScrollArea>
        {role === 'DOCTOR' && (
        <div className="w-full h-16 flex items-center justify-center px-4 border-t">
          <button
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
            onClick={() => setIsCreatingCommunity(true)}
          >
            Create Community
          </button>
        </div>
      )}
        <div className="w-full h-16 flex items-center justify-center px-4 border-t">
          <Input placeholder="Search name" />
        </div>
      </div>
    );
  }
};

export default ContactList;

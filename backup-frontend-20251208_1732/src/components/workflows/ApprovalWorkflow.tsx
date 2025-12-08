import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type ApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';

interface ApprovalWorkflowProps {
  currentStatus: ApprovalStatus;
  onStatusChange: (status: ApprovalStatus, comment?: string) => Promise<void>;
  canPublish?: boolean;
}

const statusConfig: Record<ApprovalStatus, { label: string; color: string; nextSteps: ApprovalStatus[] }> = {
  draft: { label: 'Draft', color: 'bg-gray-500', nextSteps: ['pending_review'] },
  pending_review: { 
    label: 'Pending Review', 
    color: 'bg-amber-500',
    nextSteps: ['approved', 'rejected', 'draft'] 
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-blue-500',
    nextSteps: ['published', 'draft'] 
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-500',
    nextSteps: ['draft'] 
  },
  published: { 
    label: 'Published', 
    color: 'bg-green-500',
    nextSteps: [] 
  },
};

export function ApprovalWorkflow({ currentStatus, onStatusChange, canPublish = false }: ApprovalWorkflowProps) {
  const { data: session } = useSession();
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const currentConfig = statusConfig[currentStatus];
  const availableStatuses = currentConfig.nextSteps
    .filter(status => {
      // Only allow publishing if user has permission
      if (status === 'published' && !canPublish) return false;
      return true;
    })
    .map(status => ({
      value: status,
      ...statusConfig[status]
    }));

  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(selectedStatus, comment);
      setSelectedStatus('');
      setComment('');
      setShowDialog(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge className={currentConfig.color}>
          {currentConfig.label}
        </Badge>
        
        {availableStatuses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setShowDialog(true)}
          >
            Change Status
          </Button>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Content Status</DialogTitle>
            <DialogDescription>
              Change the status of this content item and add an optional comment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value: ApprovalStatus) => setSelectedStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${status.color}`}></span>
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Comment (Optional)</Label>
              <Textarea
                placeholder="Add a comment about this status change..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={!selectedStatus || isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

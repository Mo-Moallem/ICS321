import React, { useState } from 'react';
import { Mail, SendHorizontal } from 'lucide-react';
import { apiService } from '../../../api/apiService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Input } from '../../../components/ui/Input';

export const NotificationsAdmin: React.FC = () => {
  const [daysAhead, setDaysAhead] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendResult, setSendResult] = useState<any | null>(null);
  
  const handleSendNotifications = async () => {
    if (daysAhead < 0) {
      setError('Days ahead must be a non-negative number');
      return;
    }
    
    setIsSending(true);
    setError('');
    setSuccess('');
    setSendResult(null);
    
    try {
      const result = await apiService.sendEmailReminders(daysAhead);
      setSendResult(result);
      
      if (result.success) {
        setSuccess(`Successfully sent ${result.emailsSent} emails for upcoming matches in the next ${daysAhead} day(s).`);
      } else {
        throw new Error(result.message || 'Failed to send notifications');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to send notifications: ${errorMessage}`);
      console.error('Send notifications error:', err);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Match Notifications</h2>
        <p className="text-gray-600 mt-1">
          Send email reminders to team members about upcoming matches.
        </p>
      </div>
      
      {error && <Alert variant="error" message={error} className="mb-6" onClose={() => setError('')} />}
      {success && <Alert variant="success" message={success} className="mb-6" onClose={() => setSuccess('')} />}
      
      <Card className="mb-8">
        <div className="flex items-center mb-6">
          <Mail className="h-8 w-8 text-blue-800 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Email Reminders</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Send email notifications to players, coaches, and managers about upcoming matches. 
            Specify how many days in advance you want to notify for:
          </p>
          
          <div className="max-w-md">
            <Input
              label="Days Ahead"
              type="number"
              min="0"
              value={daysAhead.toString()}
              onChange={(e) => setDaysAhead(parseInt(e.target.value) || 0)}
              placeholder="Enter number of days ahead"
              fullWidth
            />
            <p className="text-sm text-gray-500 mt-1">
              Use 0 for today's matches, 1 for tomorrow, 7 for next week, etc.
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleSendNotifications}
          isLoading={isSending}
          icon={<SendHorizontal className="h-4 w-4" />}
        >
          Send Notifications
        </Button>
      </Card>
      
      {sendResult && (
        <Card bordered>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Send Results</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Matches Found:</span>
              <span className="font-medium">{sendResult.matchesFound}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Emails Sent:</span>
              <span className="font-medium">{sendResult.emailsSent}</span>
            </div>
            
            {sendResult.failedEmails && sendResult.failedEmails.length > 0 && (
              <div className="pt-2">
                <h4 className="font-medium text-gray-900 mb-2">Failed Emails:</h4>
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <ul className="space-y-2">
                    {sendResult.failedEmails.map((failure: any, index: number) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{failure.email}:</span> {failure.error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
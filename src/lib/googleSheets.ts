import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Google Sheets API Configuration
// Note: This requires setting up Google Cloud Console credentials

interface SheetConfig {
  sheetId: string;
  apiKey: string;
  clientId: string;
}

class GoogleSheetsService {
  private config: SheetConfig;

  constructor(config: SheetConfig) {
    this.config = config;
  }

  // Initialize Google API Client
  async initialize(): Promise<boolean> {
    try {
      // Load Google API script
      await this.loadGoogleApiScript();
      
      // Initialize gapi client
      await new Promise<void>((resolve, reject) => {
        const gapi = (window as any).gapi;
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: this.config.apiKey,
              clientId: this.config.clientId,
              discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
              scope: 'https://www.googleapis.com/auth/spreadsheets',
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      toast.error('Failed to connect to Google Sheets');
      return false;
    }
  }

  // Load Google API Script
  private loadGoogleApiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-api-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.body.appendChild(script);
    });
  }

  // Authenticate user
  async authenticate(): Promise<boolean> {
    try {
      const gapi = (window as any).gapi;
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Google authentication failed');
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const gapi = (window as any).gapi;
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  // Read data from sheet
  async readData(range: string): Promise<any[][] | null> {
    try {
      const gapi = (window as any).gapi;
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.sheetId,
        range: range,
      });
      return response.result.values || null;
    } catch (error) {
      console.error('Failed to read data:', error);
      toast.error('Failed to read data from Google Sheets');
      return null;
    }
  }

  // Write data to sheet
  async writeData(range: string, values: any[][]): Promise<boolean> {
    try {
      const gapi = (window as any).gapi;
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.sheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: { values },
      });
      toast.success('Data synced to Google Sheets');
      return true;
    } catch (error) {
      console.error('Failed to write data:', error);
      toast.error('Failed to write data to Google Sheets');
      return false;
    }
  }

  // Append data to sheet
  async appendData(range: string, values: any[][]): Promise<boolean> {
    try {
      const gapi = (window as any).gapi;
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.sheetId,
        range: range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
      toast.success('Data appended to Google Sheets');
      return true;
    } catch (error) {
      console.error('Failed to append data:', error);
      toast.error('Failed to append data to Google Sheets');
      return false;
    }
  }

  // Clear data in range
  async clearData(range: string): Promise<boolean> {
    try {
      const gapi = (window as any).gapi;
      await gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.config.sheetId,
        range: range,
      });
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data in Google Sheets');
      return false;
    }
  }

  // Get sheet metadata
  async getSheetMetadata(): Promise<any | null> {
    try {
      const gapi = (window as any).gapi;
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.config.sheetId,
      });
      return response.result;
    } catch (error) {
      console.error('Failed to get metadata:', error);
      return null;
    }
  }

  // Sync T&D Report to Google Sheets
  async syncTNDReport(report: any, sheetName: string = 'TND Reports'): Promise<boolean> {
    try {
      // Prepare data rows
      const headers = [
        'Month', 'Year', 'Status', 'Submitted By', 'Submitted At',
        'New Teachers', 'Orientation Sessions', 'Batches Completed', 'Trainees Passed', 'Trainees Failed',
        'Trials Assigned', 'Trials Evaluated', 'Trial Pass Rate', 'Trial Fail Rate', 'Teachers to Live',
        'Sessions Conducted', 'Teachers Trained', 'Training Hours',
        'Teachers Audited', 'Violations', 'Warnings Issued',
        'Complaints Received', 'Complaints Resolved', 'Complaints Escalated',
        'Classes Monitored', 'Quality Audits', 'Teachers Grade A', 'Teachers Grade B', 'Teachers Grade C',
      ];

      const rowData = [
        report.month,
        report.year,
        report.status,
        report.submitted_by,
        report.submitted_at,
        report.onboarding?.new_teachers_onboarded || 0,
        report.onboarding?.orientation_sessions || 0,
        report.onboarding?.training_batches_completed || 0,
        report.onboarding?.trainees_passed || 0,
        report.onboarding?.trainees_failed || 0,
        report.trial_classes?.trials_assigned || 0,
        report.trial_classes?.trials_evaluated || 0,
        report.trial_classes?.trial_pass_rate || 0,
        report.trial_classes?.trial_fail_rate || 0,
        report.trial_classes?.teachers_to_live || 0,
        report.ongoing_training?.sessions_conducted || 0,
        report.ongoing_training?.teachers_trained || 0,
        report.ongoing_training?.training_hours || 0,
        report.compliance?.teachers_audited || 0,
        report.compliance?.violations_identified || 0,
        report.compliance?.warnings_issued || 0,
        report.parent_feedback?.complaints_received || 0,
        report.parent_feedback?.complaints_resolved || 0,
        report.parent_feedback?.complaints_escalated || 0,
        report.quality_assurance?.classes_monitored || 0,
        report.quality_assurance?.quality_audits || 0,
        report.quality_assurance?.teachers_rated_a || 0,
        report.quality_assurance?.teachers_rated_b || 0,
        report.quality_assurance?.teachers_rated_c || 0,
      ];

      // Check if headers exist
      const existingData = await this.readData(`${sheetName}!A1:A1`);
      
      if (!existingData || existingData.length === 0) {
        // Write headers first
        await this.writeData(`${sheetName}!A1:AC1`, [headers]);
      }

      // Append the report data
      await this.appendData(`${sheetName}!A:AC`, [rowData]);
      
      return true;
    } catch (error) {
      console.error('Failed to sync T&D report:', error);
      toast.error('Failed to sync report to Google Sheets');
      return false;
    }
  }
}

// Create singleton instance
export const googleSheets = new GoogleSheetsService({
  sheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
});

// Hook for Google Sheets integration
export function useGoogleSheets() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const success = await googleSheets.initialize();
    setIsInitialized(success);
  };

  const authenticate = async () => {
    const success = await googleSheets.authenticate();
    setIsAuthenticated(success);
    return success;
  };

  const syncReport = async (report: any) => {
    if (!isAuthenticated) {
      const authSuccess = await authenticate();
      if (!authSuccess) return false;
    }
    return await googleSheets.syncTNDReport(report);
  };

  return {
    isInitialized,
    isAuthenticated,
    initialize,
    authenticate,
    syncReport,
    readData: googleSheets.readData.bind(googleSheets),
    writeData: googleSheets.writeData.bind(googleSheets),
  };
}

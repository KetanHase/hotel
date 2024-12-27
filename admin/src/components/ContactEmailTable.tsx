import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';

interface ContactEmail {
  id: number;
  
  email: string;
   
  added_date: string;
}

const ContactEmailTable: React.FC = () => {
  const [emails, setEmails] = useState<ContactEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch emails from API
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data } = await axios.get('http://localhost:8081/contactsemail');
        setEmails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching emails:', error);
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
          New  Subscriber
      </Typography>
      
      {loading ? (
        <Typography variant="body1" align="center">Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell><strong>Email</strong></TableCell>
                 
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  
                  <TableCell>{email.email}</TableCell>
                   
                  <TableCell>{new Date(email.added_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ContactEmailTable;

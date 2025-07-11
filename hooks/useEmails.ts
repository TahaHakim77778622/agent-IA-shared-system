'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService, Email } from '@/lib/api';

interface EmailsState {
  emails: Email[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export function useEmails() {
  const [emailsState, setEmailsState] = useState<EmailsState>({
    emails: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  });

  const fetchEmails = useCallback(async (skip: number = 0, limit: number = 100) => {
    setEmailsState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const emails = await apiService.getEmails(skip, limit);
      setEmailsState({
        emails,
        isLoading: false,
        error: null,
        totalCount: emails.length,
      });
      return emails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des emails';
      setEmailsState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const createEmail = useCallback(async (subject: string, body: string) => {
    setEmailsState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newEmail = await apiService.createEmail(subject, body);
      setEmailsState(prev => ({
        ...prev,
        emails: [newEmail, ...prev.emails],
        isLoading: false,
        totalCount: prev.totalCount + 1,
      }));
      return newEmail;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de l\'email';
      setEmailsState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const updateEmail = useCallback(async (emailId: number, updates: Partial<Pick<Email, 'subject' | 'body'>>) => {
    setEmailsState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedEmail = await apiService.updateEmail(emailId, updates);
      setEmailsState(prev => ({
        ...prev,
        emails: prev.emails.map(email => 
          email.id === emailId ? updatedEmail : email
        ),
        isLoading: false,
      }));
      return updatedEmail;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification de l\'email';
      setEmailsState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const deleteEmail = useCallback(async (emailId: number) => {
    setEmailsState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.deleteEmail(emailId);
      setEmailsState(prev => ({
        ...prev,
        emails: prev.emails.filter(email => email.id !== emailId),
        isLoading: false,
        totalCount: prev.totalCount - 1,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'email';
      setEmailsState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const getEmail = useCallback(async (emailId: number) => {
    try {
      const email = await apiService.getEmail(emailId);
      return email;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de l\'email';
      setEmailsState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setEmailsState(prev => ({ ...prev, error: null }));
  }, []);

  // Charger les emails au montage du composant
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return {
    ...emailsState,
    fetchEmails,
    createEmail,
    updateEmail,
    deleteEmail,
    getEmail,
    clearError,
  };
} 
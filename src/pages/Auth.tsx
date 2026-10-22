"use client";

import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/profile');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[450px]"
        >
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="space-y-1 pt-10 px-10 text-center">
              <CardTitle className="text-3xl font-black">Добро пожаловать</CardTitle>
              <p className="text-muted-foreground">Войдите или создайте аккаунт</p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <SupabaseAuth 
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'hsl(345, 100%, 25%)',
                        brandAccent: 'hsl(345, 100%, 35%)',
                      },
                      radii: {
                        borderRadiusButton: '0.75rem',
                        inputBorderRadius: '0.75rem',
                      }
                    }
                  }
                }}
                providers={[]}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email адрес',
                      password_label: 'Пароль',
                      button_label: 'Войти',
                    },
                    sign_up: {
                      email_label: 'Email адрес',
                      password_label: 'Придумайте пароль',
                      button_label: 'Зарегистрироваться',
                    }
                  }
                }}
                theme="light"
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;
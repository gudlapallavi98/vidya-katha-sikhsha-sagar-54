
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginWithPassword from "./LoginWithPassword";
import LoginWithOTP from "./LoginWithOTP";

const LoginOptions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
        <CardDescription>
          Choose your preferred login method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password" className="mt-6">
            <LoginWithPassword />
          </TabsContent>
          
          <TabsContent value="otp" className="mt-6">
            <LoginWithOTP />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoginOptions;

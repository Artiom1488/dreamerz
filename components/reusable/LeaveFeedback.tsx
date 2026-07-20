import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const LeaveFeedback = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">Leave feedback</DialogTitle>
                    <DialogDescription className="text-center">
                        Your feedback will help us improve our services
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea placeholder="Leave feedback..." className="min-h-[120px] resize-none" />
                </div>
                <Button variant="gradient_fill" className="w-full">Send</Button>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveFeedback;
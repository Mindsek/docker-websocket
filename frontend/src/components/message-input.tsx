"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Send } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Schéma de validation pour le message
const messageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide"),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = (values: MessageFormValues) => {
    onSendMessage(values.content)
    form.reset()
  }

  return (
    <div className="border-t p-3 bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Écrivez votre message..."
                    disabled={disabled}
                    {...field}
                    className="focus-visible:ring-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={disabled || !form.formState.isValid}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </Button>
        </form>
      </Form>
    </div>
  )
}

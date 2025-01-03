"use client"
import React, { useEffect } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import useGeneratedStore from '@/store/useGeneratedStore'



//defining form schema
export const ImageGenerationformSchema = z.object({
    model: z.string({
        required_error: 'Model is required'
    }),
    prompt: z.string({
        required_error: 'Prompt is required'
    }),
    guidance: z.number({
        required_error: 'Guidance scale is required!'
    }),
    num_outputs: z.number().min(1, { message: 'Number of outputs should be at least 1.' }).max(4, { message: 'Number of outputs must be less than 4' }),
    aspect_ratio: z.string({ required_error: 'Aspect ratio is required' }),
    output_format: z.string({ required_error: 'Output format is required' }),
    output_quality: z.number().min(1, { message: 'Output quality should be at least 1' }).max(100, { message: 'Output quality should be at least 100' }),
    num_inference_steps: z.number().min(1, { message: 'Minumum should be 1' }).max(50, { message: 'Maximum number should be 50' })

})

const Configurations = () => {
    const generateImage = useGeneratedStore((state) => state.generateImage)

    const form = useForm<z.infer<typeof ImageGenerationformSchema>>({
        resolver: zodResolver(ImageGenerationformSchema),
        defaultValues: {
            model: "black-forest-labs/flux-schnell",
            prompt: '',
            guidance: 3.5,
            num_outputs: 1,
            output_format: 'jpg',
            aspect_ratio: "1:1",
            output_quality: 80,
            num_inference_steps: 4
        },
    })

    useEffect(() => {
        const subscription = form.watch((value,{name}) => {
            if(name === 'model'){
                let newSteps;
                if(value.model === 'black-forest-labs/flux-schnell'){
                    newSteps=4
                }else{
                    newSteps=28
                }
                if(newSteps!=undefined){
                    form.setValue('num_inference_steps', newSteps)
                }
            }
        })
        return () => subscription.unsubscribe()
    },[form])

    async function onSubmit(values: z.infer<typeof ImageGenerationformSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await generateImage(values)
        
    }
    return (
        <TooltipProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <fieldset className='grid gap-6 p-4 bg-background rounded-lg border'>
                        <legend className='text-sm -ml-1 px-1 font-medium'>Settings</legend>
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between'>Model
                                        <Tooltip>
                                            <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                            <TooltipContent>
                                                <p>You can select any model for generating image from the dropdown</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a model for generating the image" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="black-forest-labs/flux-dev">Flux dev</SelectItem>
                                            <SelectItem value="black-forest-labs/flux-schnell">Flux schnell</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-2 gap-2'>
                            <FormField
                                control={form.control}
                                name="aspect_ratio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex justify-between items-center'>Aspect ratio
                                            <Tooltip>
                                                <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Choose your aspect ratio</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a model for generating the image" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1:1">1:1</SelectItem>
                                                <SelectItem value="16:9">16:9</SelectItem>
                                                <SelectItem value="9:16">9:16</SelectItem>
                                                <SelectItem value="21:9">21:9</SelectItem>
                                                <SelectItem value="9:21">9:21</SelectItem>
                                                <SelectItem value="4:5">4:5</SelectItem>
                                                <SelectItem value="5:4">5:4</SelectItem>
                                                <SelectItem value="4:3">4:3</SelectItem>
                                                <SelectItem value="3:4">3:4</SelectItem>
                                                <SelectItem value="2:3">2:3</SelectItem>
                                                <SelectItem value="3:2">3:2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="num_outputs"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between'>Number of outputs
                                            <Tooltip>
                                                <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Choose the number of outputs you want</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} max={4} {...field} onChange={(event) => field.onChange(+event.target.value)} />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="guidance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between'>
                                        <div className='flex items-center gap-2'>
                                            Guidance
                                            <Tooltip>
                                                <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Prompt guidance for the generated image</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {field.value}

                                    </FormLabel>
                                    <FormControl>
                                        <Slider defaultValue={[field.value]} min={0} max={10} step={0.5} onValueChange={value => field.onChange(value[0])} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="num_inference_steps"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between'>
                                    <div className='flex items-center gap-2'>
                                            Number of inference steps
                                            <Tooltip>
                                                <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Number of De-noising steps</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        {field.value}

                                    </FormLabel>
                                    <FormControl>
                                        <Slider defaultValue={[field.value]} min={1} max={form.getValues('model') === 'black-forest-labs/flux-schnell'? 4:50} step={1} onValueChange={value => field.onChange(value[0])} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="output_quality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex justify-between'>
                                    <div className='flex items-center gap-2'>
                                            Output quality
                                            <Tooltip>
                                                <TooltipTrigger><InfoIcon className='h-5 w-5' /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Choose the quality of the image required</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        {field.value}

                                    </FormLabel>
                                    <FormControl>
                                        <Slider defaultValue={[field.value]} min={1} max={100} step={1} onValueChange={value => field.onChange(value[0])} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="output_format"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Output Format</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a model for generating the image" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="webp">Webp</SelectItem>
                                            <SelectItem value="jpg">Jpg</SelectItem>
                                            <SelectItem value="png">Png</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter prompt to generate image"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type="submit">Generate</Button>
                    </fieldset>

                </form>
            </Form>
        </TooltipProvider>

    )
}

export default Configurations
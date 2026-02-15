import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { FormField } from './FormField';

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginFormProps {
    submitUrl?: string;
    canResetPassword?: boolean;
    resetPasswordUrl?: string;
    onSuccess?: () => void;
}

export function LoginForm({
    submitUrl = '/login',
    canResetPassword = true,
    resetPasswordUrl = '/forgot-password',
    onSuccess,
}: LoginFormProps) {
    const form = useForm<LoginFormData>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(submitUrl, {
            onSuccess: () => {
                form.reset('password');
                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6">
                <FormField
                    label="Alamat Email"
                    htmlFor="email"
                    error={form.errors.email}
                    required
                >
                    <Input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        autoFocus
                        autoComplete="email"
                        placeholder="email@contoh.com"
                        disabled={form.processing}
                    />
                </FormField>

                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        {canResetPassword && (
                            <TextLink
                                href={resetPasswordUrl}
                                className="ml-auto text-sm"
                            >
                                Lupa password?
                            </TextLink>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                        autoComplete="current-password"
                        placeholder="Password"
                        disabled={form.processing}
                    />
                    <InputError message={form.errors.password} />
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        checked={form.data.remember}
                        onCheckedChange={(checked) =>
                            form.setData('remember', checked === true)
                        }
                        disabled={form.processing}
                    />
                    <Label htmlFor="remember">Ingat saya</Label>
                </div>

                <Button
                    type="submit"
                    className="mt-4 w-full"
                    disabled={form.processing}
                >
                    {form.processing && <Spinner className="mr-2" />}
                    Masuk
                </Button>
            </div>
        </form>
    );
}

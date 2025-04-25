"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Login() {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://smartcupapi.onrender.com/administrador")

      if (!response.ok) {
        throw new Error("Erro ao conectar com o servidor")
      }

      const data = await response.json()

      // Procurar usuário com login e senha correspondentes
      const user = data.resultado.find((user) => user.login === login && user.senha === senha && user.ativo)

      if (user) {
        // Armazenar informações do usuário no localStorage
        localStorage.setItem("user", JSON.stringify(user))
        // Redirecionar para o painel
        router.push("/dashboard")
      } else {
        setError("Login ou senha inválidos")
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Erro ao conectar com o servidor. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Home
          </Link>
        </Button>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Smart Cup Logo" width={120} height={120} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gradient">Smart Cup</h1>
          <p className="text-gray-500">Acesse o painel administrativo</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Nome de usuário</Label>
                <Input
                  id="login"
                  placeholder="Seu nome de usuário"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="bg-white/90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-white/90"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Entrar
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-xs text-gray-500">Não tem uma conta? Entre em contato com o administrador.</p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Smart Cup. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

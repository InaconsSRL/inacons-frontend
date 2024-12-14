# Verificar si se ejecuta como administrador
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Este script requiere permisos de administrador. Por favor, ejecutar como administrador."
    pause
    exit
}

# Configuración
$hostsFile = "$env:windir\System32\drivers\etc\hosts"
$sitiosBloquear = @(
    "facebook.com", "*.facebook.com", "fb.com", "*.fb.com",
    "instagram.com", "*.instagram.com",
    "twitter.com", "*.twitter.com", "x.com", "*.x.com",
    "tiktok.com", "*.tiktok.com", "musical.ly", "*.musical.ly",
    "linkedin.com", "*.linkedin.com",
    # Dominios específicos de YouTube
    "youtube.com", "www.youtube.com",
    "m.youtube.com", "*.youtube.com",
    "youtu.be", "*.youtu.be",
    "youtube-nocookie.com", "*.youtube-nocookie.com",
    "yt.be", "*.yt.be",
    "ytimg.com", "*.ytimg.com",
    "googlevideo.com", "*.googlevideo.com",
    "youtube.googleapis.com",
    "reddit.com", "*.reddit.com",
    "pinterest.com", "*.pinterest.com",
    "snapchat.com", "*.snapchat.com",
    "whatsapp.com", "*.whatsapp.com"
)

function Bloquear-RedesSociales {
    try {
        $contenidoActual = Get-Content $hostsFile
        $nuevasEntradas = @()
        
        foreach ($sitio in $sitiosBloquear) {
            # Modificamos para asegurar que se agreguen todas las entradas
            if (-not ($contenidoActual -match "127\.0\.0\.1\s+$([regex]::Escape($sitio))$")) {
                $nuevasEntradas += "127.0.0.1 $sitio"
                # Agregar también la versión con www. si no existe
                if ($sitio -notmatch "^www\.") {
                    $nuevasEntradas += "127.0.0.1 www.$sitio"
                }
            }
        }

        if ($nuevasEntradas.Count -gt 0) {
            Add-Content -Path $hostsFile -Value $nuevasEntradas -Force
            Write-Host "Sitios bloqueados exitosamente."
        } else {
            Write-Host "Los sitios ya están bloqueados."
        }
    } catch {
        Write-Host "Error al bloquear sitios: $($_.Exception.Message)"
    }
}

function Desbloquear-RedesSociales {
    try {
        $contenido = Get-Content $hostsFile | Where-Object {
            $linea = $_
            -not ($sitiosBloquear | Where-Object { $linea -match $_ })
        }
        
        Set-Content -Path $hostsFile -Value $contenido -Force
        Write-Host "Sitios desbloqueados exitosamente."
    } catch {
        Write-Host "Error al desbloquear sitios: $($_.Exception.Message)"
    }
}

do {
    Clear-Host
    Write-Host "=== Bloqueador de Redes Sociales ==="
    Write-Host "1. Bloquear redes sociales"
    Write-Host "2. Desbloquear redes sociales"
    Write-Host "3. Salir"
    
    $opcion = Read-Host "`nSeleccione una opción"
    
    switch ($opcion) {
        "1" { 
            Bloquear-RedesSociales
            Write-Host "`nPor favor, ejecute 'ipconfig /flushdns' y reinicie su navegador"
            pause
        }
        "2" { 
            Desbloquear-RedesSociales
            Write-Host "`nPor favor, ejecute 'ipconfig /flushdns' y reinicie su navegador"
            pause
        }
        "3" { exit }
        default { 
            Write-Host "Opción inválida"
            pause
        }
    }
} while ($true)

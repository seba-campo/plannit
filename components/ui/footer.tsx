import React from "react";


export function CustomFooter(){
    return (          
    <footer className="relative z-10 border-t border-accent/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
    
        <div className=' w-[200px] text-center '>
            <span className="text-sm font-semibold text-neon">PlannIt</span>
        </div>

        <div className=' w-[200px] text-center '>
            <a             
                href="/legal"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground w-[200px]" >

                    Terms & Conditions
            </a>
    
        </div>

        <div className=' w-[200px] text-center '>
            <a
                href="https://sebacampo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground w-[200px]"
            >
                {"© "}{new Date().getFullYear()}{" Made with ❤️ by sCampo"}
            </a>
        </div>
        </div>
    </footer>
    )
}
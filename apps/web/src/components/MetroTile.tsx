import React from 'react';
import { Link } from 'react-router-dom';

interface MetroTileProps {
    title: string;
    icon?: React.ReactNode;
    count?: number | string;
    color: 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'purple' | 'teal' | 'red' | 'green' | 'pink' | 'indigo' | 'amber' | 'emerald';
    size?: 'small' | 'medium' | 'wide' | 'large';
    to?: string;
    onClick?: () => void;
    backgroundImage?: string;
    className?: string;
}

const colorMap: Record<MetroTileProps['color'], string> = {
    cyan: 'bg-cyan-500',
    magenta: 'bg-fuchsia-500',
    lime: 'bg-lime-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    teal: 'bg-teal-500',
    red: 'bg-red-600',
    green: 'bg-green-600',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-600',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-600',
};

const sizeMap: Record<NonNullable<MetroTileProps['size']>, string> = {
    small: 'col-span-1 row-span-1 min-h-[120px]',
    medium: 'col-span-2 row-span-2 min-h-[248px]',
    wide: 'col-span-2 row-span-1 min-h-[120px]',
    large: 'col-span-4 row-span-2 min-h-[248px]',
};

export const MetroTile: React.FC<MetroTileProps> = ({
    title,
    icon,
    count,
    color,
    size = 'small',
    to,
    onClick,
    backgroundImage,
    className = ''
}) => {
    const baseClassName = `
        group relative flex flex-col justify-between overflow-hidden p-4 cursor-pointer
        transition-all duration-150 ease-out
        hover:brightness-110 active:scale-95
        ${backgroundImage ? 'bg-gray-900' : colorMap[color]} 
        ${sizeMap[size]} 
        ${className}
    `;

    const content = (
        <>
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="h-full w-full object-cover opacity-100 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </div>
            )}

            {/* Top Row: Icon & Count */}
            <div className="relative z-10 flex items-start justify-between">
                {icon && (
                    <div className="text-white/90 transition-transform group-hover:scale-110">
                        {icon}
                    </div>
                )}
                {count && (
                    <span className="text-xl font-light text-white/80">
                        {count}
                    </span>
                )}
            </div>

            {/* Bottom Row: Title */}
            <div className="relative z-10 bg-gradient-to-t from-black/50 to-transparent -mx-4 -mb-4 px-4 py-3 mt-auto">
                <h3 className="text-base font-bold uppercase tracking-wider text-white leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {title}
                </h3>
            </div>

            {/* Hover Highlight Border */}
            <div className="absolute inset-0 border-2 border-white/0 transition-colors group-hover:border-white/20" />
        </>
    );

    // Conditional rendering: Link when `to` is provided, div otherwise
    if (to) {
        return (
            <Link to={to} onClick={onClick} className={baseClassName}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className={baseClassName}>
            {content}
        </div>
    );
};

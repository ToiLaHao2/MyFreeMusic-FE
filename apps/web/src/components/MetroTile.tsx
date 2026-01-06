import React from 'react';
import { Link } from 'react-router-dom';

interface MetroTileProps {
    title: string;
    icon?: React.ReactNode;
    count?: number | string;
    color: 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'purple' | 'teal';
    size?: 'small' | 'medium' | 'wide' | 'large';
    to?: string;
    onClick?: () => void;
    backgroundImage?: string;
    className?: string;
}

const colorMap: Record<MetroTileProps['color'], string> = {
    cyan: 'bg-metro-cyan',
    magenta: 'bg-metro-magenta',
    lime: 'bg-metro-lime',
    orange: 'bg-metro-orange',
    blue: 'bg-metro-blue',
    purple: 'bg-metro-purple',
    teal: 'bg-metro-teal',
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
    const Component = to ? Link : 'div';
    const linkProps = to ? { to } : {};

    return (
        <Component
            {...linkProps}
            onClick={onClick}
            className={`
                group relative flex flex-col justify-between overflow-hidden p-4 cursor-pointer
                transition-all duration-150 ease-out
                hover:brightness-110 active:scale-95
                ${colorMap[color]} 
                ${sizeMap[size]} 
                ${className}
            `}
        >
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            <div className="relative z-10">
                <h3 className="text-base font-semibold uppercase tracking-wider text-white leading-tight">
                    {title}
                </h3>
            </div>

            {/* Hover Highlight Border */}
            <div className="absolute inset-0 border-2 border-white/0 transition-colors group-hover:border-white/20" />
        </Component>
    );
};

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';

interface ResponsiveInfo {
  screenWidth: number;
  screenHeight: number;
  device: 'mobile' | 'tablet' | 'desktop';
  viewport: string | null;
  breakpoints: {
    sm: boolean;  // >= 640px
    md: boolean;  // >= 768px
    lg: boolean;  // >= 1024px
    xl: boolean;  // >= 1280px
  };
  responsiveClasses: string[];
}

export function ResponsiveDebugger() {
  const [info, setInfo] = useState<ResponsiveInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const getResponsiveInfo = useCallback((): ResponsiveInfo => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    
    const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null;
    
    const breakpoints = {
      sm: width >= 640,
      md: width >= 768,
      lg: width >= 1024,
      xl: width >= 1280,
    };
    
    // Simplified responsive class detection to avoid performance issues
    const responsiveClasses: string[] = [];
    try {
      const sampleElements = document.querySelectorAll('[class*="lg:"], [class*="md:"], [class*="sm:"]');
      const classSet = new Set<string>();
      
      // Limit to first 20 elements to avoid performance issues
      const limitedElements = Array.from(sampleElements).slice(0, 20);
      
      limitedElements.forEach(el => {
        const classList = el.className.split(' ');
        classList.forEach(cls => {
          if (cls.match(/^(sm|md|lg|xl):/)) {
            classSet.add(cls.split(':')[0]);
          }
        });
      });
      
      responsiveClasses.push(...Array.from(classSet).slice(0, 5)); // Limit to 5 classes
    } catch (error) {
      console.warn('Error detecting responsive classes:', error);
    }
    
    return {
      screenWidth: width,
      screenHeight: height,
      device,
      viewport,
      breakpoints,
      responsiveClasses
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const updateInfo = () => {
      try {
        setInfo(getResponsiveInfo());
      } catch (error) {
        console.error('Error updating responsive info:', error);
      }
    };
    
    updateInfo();
    
    // Throttled resize handler to avoid performance issues
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateInfo, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isVisible, getResponsiveInfo]);

  const refresh = useCallback(() => {
    try {
      setInfo(getResponsiveInfo());
    } catch (error) {
      console.error('Error refreshing responsive info:', error);
    }
  }, [getResponsiveInfo]);

  // Memoize expensive calculations
  const deviceIcon = useMemo(() => {
    if (!info) return Monitor;
    return info.device === 'mobile' ? Smartphone : 
           info.device === 'tablet' ? Tablet : Monitor;
  }, [info?.device]);

  const isViewportOptimal = useMemo(() => {
    return info?.viewport?.includes('width=device-width') && 
           info?.viewport?.includes('initial-scale=1.0');
  }, [info?.viewport]);

  if (!isVisible) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4">
          <Button 
            onClick={() => setIsVisible(true)}
            className="w-full"
            variant="outline"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Activer le Débogueur de Responsivité
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!info) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Chargement des informations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const DeviceIcon = deviceIcon;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DeviceIcon className="w-5 h-5" />
            Débogueur de Responsivité
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
              ✕
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations d'écran */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{info.screenWidth}px</div>
            <div className="text-sm text-muted-foreground">Largeur</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{info.screenHeight}px</div>
            <div className="text-sm text-muted-foreground">Hauteur</div>
          </div>
        </div>

        {/* Type d'appareil */}
        <div className="text-center">
          <Badge 
            variant={info.device === 'mobile' ? 'default' : 'secondary'}
            className="px-4 py-2"
          >
            📱 {info.device.charAt(0).toUpperCase() + info.device.slice(1)}
          </Badge>
        </div>

        {/* Meta Viewport */}
        <div className="space-y-2">
          <h4 className="font-medium">Meta Viewport</h4>
          <div className={`p-3 rounded-lg border ${isViewportOptimal ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span>{isViewportOptimal ? '✅' : '❌'}</span>
              <span className="font-medium">
                {isViewportOptimal ? 'Optimal' : 'Problématique'}
              </span>
            </div>
            <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
              {info.viewport || 'Meta viewport manquant'}
            </code>
          </div>
        </div>

        {/* Points de rupture Tailwind */}
        <div className="space-y-2">
          <h4 className="font-medium">Points de Rupture Tailwind</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(info.breakpoints).map(([bp, active]) => (
              <div key={bp} className={`p-2 rounded text-center ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                <span className="font-medium">{bp.toUpperCase()}</span>
                <span className="ml-2">{active ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Classes responsives détectées */}
        {info.responsiveClasses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Classes Responsives Détectées</h4>
            <div className="flex flex-wrap gap-1">
              {info.responsiveClasses.map(cls => (
                <Badge key={cls} variant="outline" className="text-xs">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Test rapide */}
        <div className="space-y-2">
          <h4 className="font-medium">Test Visuel</h4>
          <div className="p-3 bg-blue-100 rounded text-center">
            <div className="block sm:hidden">📱 Visible sur Mobile uniquement</div>
            <div className="hidden sm:block md:hidden">📱 Visible sur SM</div>
            <div className="hidden md:block lg:hidden">💻 Visible sur MD</div>
            <div className="hidden lg:block">🖥️ Visible sur LG+</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
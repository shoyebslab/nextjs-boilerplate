"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores/language.store";
import { SliderSlideData } from "@/features/settings/api/settings.api";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  slides?: SliderSlideData[];
  className?: string;
}

export function HeroCarousel({ slides = [], className }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { locale } = useLanguageStore();

  const activeSlides = slides.filter((s) => s.is_active);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Autoplay timer
  useEffect(() => {
    if (!api || count <= 1) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [api, count]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (activeSlides.length === 0) return null;

  return (
    <section
      className={cn("relative w-full overflow-hidden bg-slate-950", className)}
      aria-label="Hospital Highlights Carousel"
    >
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {activeSlides.map((slide, index) => {
            const title = locale === "bn" ? slide.title_bn : slide.title_en;
            const subtitle = locale === "bn" ? slide.subtitle_bn : slide.subtitle_en;
            const btnText = locale === "bn" ? slide.button_text_bn : slide.button_text_en;
            const isCurrent = current === index;
            const hasMobileImg = !!slide.mobile_image;

            return (
              <CarouselItem
                key={slide.id || index}
                className="pl-0 relative min-w-0 flex-[0_0_100%]"
              >
                {/* 
                  Container aspect ratio:
                  - Mobile: 15 / 7 (matches 750x350 mobile slide graphics)
                  - Desktop: 1920 / 650 (~2.95:1, matches 1920x650 desktop graphics)
                  Prevents digital zoom crop and blurriness.
                */}
                <div className="relative w-full aspect-[15/7] md:aspect-[1920/650] max-h-[650px] min-h-[220px]">
                  {/* Mobile-Optimized Graphic (under 768px) */}
                  {hasMobileImg && (
                    <div className="block md:hidden absolute inset-0">
                      <Image
                        src={slide.mobile_image!}
                        alt={title}
                        fill
                        priority={index === 0}
                        quality={95}
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 750px"
                      />
                    </div>
                  )}

                  {/* Desktop Crisp Panoramic Graphic (768px and above) */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      hasMobileImg ? "hidden md:block" : "block"
                    )}
                  >
                    <Image
                      src={slide.desktop_image}
                      alt={title}
                      fill
                      priority={index === 0}
                      quality={95}
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1920px"
                    />
                  </div>

                  {/* 
                    Subtle, Authentic Hospital Gradient Overlay
                    Matches structuredstarline: allows photo clarity while keeping typography readable
                  */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(9, 32, 66, 0.65) 0%, rgba(9, 32, 66, 0.25) 45%, rgba(9, 32, 66, 0) 70%), linear-gradient(to top, rgba(9, 32, 66, 0.6) 0%, rgba(9, 32, 66, 0) 35%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Slide Content Caption */}
                  <div className="container absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 lg:pb-20 pointer-events-auto">
                    <div
                      className={cn(
                        "max-w-2xl space-y-2 sm:space-y-3 transition-all duration-700 transform",
                        isCurrent
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      )}
                    >
                      {/* Cyan Accent Indicator */}
                      {/* <div className="h-1 sm:h-1.5 w-10 sm:w-12 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-sm" /> */}

                      <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                        {title}
                      </h2>

                      {/* {subtitle && (
                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-100 line-clamp-2 leading-relaxed drop-shadow">
                          {subtitle}
                        </p>
                      )}

                      {slide.button_link && btnText && (
                        <div className="pt-1 sm:pt-2">
                          <Button asChild size="sm" className="gap-2 shadow-lg font-bold text-xs sm:text-sm h-8 sm:h-9">
                            <Link href={slide.button_link}>
                              <span>{btnText}</span>
                              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                          </Button>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Carousel Previous / Next Nav Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#0b3c6f]/70 text-white backdrop-blur border border-white/20 shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#0b3c6f]/70 text-white backdrop-blur border border-white/20 shadow-md hover:bg-sky-600 hover:scale-105 transition-all"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Slide Pagination Indicator Pills */}
            <div
              className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-20 flex justify-center gap-1.5"
              role="tablist"
              aria-label="Carousel pagination"
            >
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollTo(idx)}
                  role="tab"
                  aria-selected={current === idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    current === idx
                      ? "w-8 bg-sky-400"
                      : "w-3 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </section>
  );
}

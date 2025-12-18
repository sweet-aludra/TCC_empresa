//tela de carregamento
        window.addEventListener("load", () => {
            const loader = document.getElementById("loader");

            setTimeout(() => {
                loader.style.opacity = "0";

                setTimeout(() => {
                    loader.style.display = "none";
                }, 400);
            }, 1000); // 1 segundos visível
        });

document.querySelectorAll(".carrosel-galeria-videos").forEach(carrosel => {
            const slides = carrosel.querySelector(".slides");
            if (!slides) return;

            const itens = slides.children;
            if (!itens || itens.length === 0) return;

            const prev = carrosel.querySelector(".prev");
            const next = carrosel.querySelector(".next");

            let index = 0;
            let itemWidth = 0;
            const GAP = 20;

            function calcItemWidth() {
                if (itens.length === 0) return 0;
                const rect = itens[0].getBoundingClientRect();
                itemWidth = Math.round(rect.width) + GAP;
            }

            function updateCarousel(animate = true) {
                if (!itemWidth) calcItemWidth();
                if (!itemWidth) return;

                slides.style.transition = animate ? "" : "none";
                slides.style.transform = `translateX(${-index * itemWidth}px)`;

                if (!animate) slides.getBoundingClientRect();

                playVisibleVideo();

                if (!animate) slides.style.transition = "";
            }

            // botões
            if (prev) {
                prev.addEventListener("click", () => {
                    index--;
                    if (index < 0) index = itens.length - 1;
                    updateCarousel();
                });
            }

            if (next) {
                next.addEventListener("click", () => {
                    index++;
                    if (index >= itens.length) index = 0;
                    updateCarousel();
                });
            }

            // lista de vídeos
            const videos = slides.querySelectorAll("video");

            // tocar só o vídeo visível
            function playVisibleVideo() {
                videos.forEach((v, i) => {
                    if (i === index) {
                        v.muted = true;
                        v.playsInline = true;
                        v.play().catch(() => { });
                    } else {
                        try { v.pause(); } catch (e) { }
                        v.currentTime = 0;
                    }
                });
            }

            // SE O VÍDEO TERMINAR → AVANÇA PARA O PRÓXIMO SLIDE 
            /*videos.forEach((v, i) => {
                v.addEventListener("ended", () => {
                    index++;
                    if (index >= itens.length) index = 0;
                    updateCarousel();
                });
            });*/

            // recalcular no resize
            window.addEventListener("resize", () => {
                calcItemWidth();
                updateCarousel(false);
            });

            // garantir que calcule tamanho após carregar metadados
            if (videos.length > 0) {
                let loaded = 0;
                videos.forEach(v => {
                    if (v.readyState >= 1) {
                        loaded++;
                    } else {
                        v.addEventListener("loadedmetadata", () => {
                            loaded++;
                            if (loaded === videos.length) {
                                calcItemWidth();
                                updateCarousel(false);
                            }
                        }, { once: true });
                    }
                });

                if (loaded === videos.length) {
                    calcItemWidth();
                    updateCarousel(false);
                }
            } else {
                calcItemWidth();
                updateCarousel(false);
            }

            // permitir que o usuário ligue o som clicando
            carrosel.addEventListener("click", () => {
                const v = videos[index];
                if (v) v.muted = false;
            });
        });
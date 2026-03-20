# Gul Bil
## Information
Vores projekt er en lille hjemmeside med et spil, hvor spillere kan se hvem som spotter flest gule biler, som kører hen over skærmen.

Dette spil bruger arduinoer som controllers, og vil give feedback på spillet status.

- Frontend kodet i Next
- Backend C# Asp net core
- Arduino C++
- Kommunikation mellem api og arduinoer bruger MQTT ved hjælp af RabbitMQ.

### Frontend
- Skal kunne oprette bruger, håndtere login og redigere bruger profiler.
- Den skal kunne starte et nyt spil, vise score, vælge spillere og tingængelige arduinoer.
- Vi laver det så der kommer biler på skærmen med forskellige farver

### Api
- User management, oprettelse og redigering... og avartars **(S3 minio)**
- håntere opstart af spil, gemme og håndter score
- Threaded system til at håndetere spilrum, og websockets **(SignalR)** til at kommunikere med spillere som deltager.
- Snakke med rabbitMQ og sende info om spillet, de er forbundet til.

### Arduino
- Skal bruges som controller til spillet.
- De skal have hver en uniqe id, til at identificere dem.
- Vise info om spillet og deres status **(Connected, ready, ingame)** på skærmen
- Feedback for en gul bil **(Vibration, ved success og f.eks smileyer)**
- (mulig udvidelse: stød armbånd)

## Modeller til spillet
### Bil
- Farve
- Hastighed
- Vognbane
- Status for taget gul bil.

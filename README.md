## Aplikacja webowa do umieszczania ogłoszeń motoryzacyjnych.
----
### Cel projektu

Odnowienie oraz poszerzenie wiedzy na temat pisania aplikacji webowych w języku JavaScript z wykorzystaniem technologii NodeJS.

----
### Opis działania

Pierwszym pomysłem była wypożyczalnia aut, jednakże zdecydowałem się, że będzie to strona na wzór otmoto.pl czyli przeznaczona do umieszczania ogłoszeń motoryzacyjnych w celu sprzedaży. Do wglądu w ogłoszenia nie trzeba posiadać konta, jednakże do umieszczenia swojego ogłoszenia wymagana jest wcześniejsza rejestracja konta. Po zalogowaniu i wypełnieniu formularza ogłoszenia, ogłoszenie przechodzi wpierw weryfikację, a następnie zostaje umieszczone bądź odrzucone. W przypadku tego drugiego użytkownik uzyskuje informację jaki był powód odrzucenia. Istnieje również możliwość zgłaszania nieprawidłowości przez użytkownika do administratora w formie prywatnej wiadomości.

---
### Role w projekcie

* _główny administrator_ - możliwość modyfikacji uprawnień użytkowników, edycji i usuwania ogłoszeń + to co administrator i user. Konto headadmina: __login__: _kropeq_, __hasło__:_test123_
* _administrator_ - odpowiedzialność za akceptowanie/odrzucanie ogłoszeń, nadzór nad zawartością ogłoszeń, modyfikacja listy modeli aut dostępnych na rynku służące jako lista wyboru przy wstawianiu ogłoszenia, wgląd do zgłaszanych usterek( TODO ) + to co user. Konto admina: __login__: _admin_, __hasło__:_admin_
* _użytkownik_ - możliwość umieszczania ogłoszeń aut/motocykli, prywatne wiadomości( TODO ), zgłaszanie usterek.

---
### Funkcjonalność

* rejestracja
* logowanie
* możliwość wglądu i modyfikacji profilu
* podział na role: użytkownik, administrator, główny administrator
* zarządzanie uprawnieniami użytkowników
* umieszczanie nowych ogłoszeń sprzedaży aut/motocykli
* akceptowanie/odrzucanie przez administratora umieszczanych ogłoszeń
* zgłaszanie powodu odrzucenia ogłoszenia do użytkownika ( TODO )
* lista ogłoszeń aut/motocykli
* wyszukiwarka ogłoszeń - precyzowanie wyników ( TODO )
* modyfikacja istniejących ogłoszeń
* szczegóły ogłoszeń z możliwością przewijania umieszczonych zdjęć
* prywatne wiadomości ( TODO )
* feedback ( TODO )
* paginacja ( TODO )
* inne pomysły ( TODO )
* modyfikacja wyglądu strony - zdecydowanie ładniejszy i tematyczny CSS ( TODO )


---
### Wykorzystane moduły NodeJS:

1. Body-parser ( parsowanie parametrów przekazywanych przez url )
2. EJS ( wykorzystanie informacji z bazy danych do wytworzenia szablonu HTML )
3. Express ( framework z zestawem funkcji do obsługi aplikacji sieciowej, routing )
4. Express-session ( przechowywanie parametrów sesji )
5. Fs ( sprawdzanie egzystencji oraz tworzenie struktury folderów )
6. Http ( serwer HTTP wykorzystujący moduł express )
7. Mongoose ( stworzenie modeli danych i przechowywanie ich w bazie danych MongoDB )
8. Multer ( przetwarzanie i zapisywanie umieszczanych plików w formularzach )

---
### Sposób uruchomienia:

1. Instalacja [nodeJS](https://nodejs.org/en/).
2. Pobranie repozytorium.
3. Instalacja projektu: __npm install__
4. Uruchomienie serwera: __npm start__
5. Uruchomienie aplikacji w przeglądarce: __localhost:8080__

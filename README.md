The aim of the project is to reserve meeting rooms in a company. To create a meeting, you need to choose the room, participants, date and time.

# SOA_Meetings_Reservations

To start the entire project, simply run the following command at the root of the project:  

```bash
docker compose up --build -V
```

This command launches:  

### **Microfrontends (Angular, Nx + Module Federation)**  
The project uses **Nx with Module Federation** to manage the microfrontends. There are **5** microfrontends:  
- `main-app` (Host)  
- `auth` (Remote)  
- `room` (Remote)  
- `meeting` (Remote)  
- `user` (Remote)  

### **Microservices (NestJS)**  
There are **4 microservices**:  
- `auth`  
- `room`  
- `meeting`  
- `notification`  

### **Technologies Used**  
- **Kafka** and **RabbitMQ** for microservices communication  
- **MongoDB** as the database  
- **Nginx** as a reverse proxy and load balancer  
- **REST API** with authentication using a token stored in cookies  
- **Docker** for containerization and orchestration  
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 03 17" src="https://github.com/user-attachments/assets/1d57ee08-7f06-436e-bf8f-2a0d24520f35" />

---  

### Here you can find a little demo :

**Sign Up**
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 33 46" src="https://github.com/user-attachments/assets/9b479696-7d0f-4631-b2b5-8a33fdb153d1" />

*Before connexion: no cookie*
<img width="1710" alt="Capture d’écran 2025-02-07 à 17 59 20" src="https://github.com/user-attachments/assets/7e544446-648f-4e7e-a939-dcf066b51b8f" />

*After :*
<img width="1710" alt="Capture d’écran 2025-02-07 à 17 59 41" src="https://github.com/user-attachments/assets/daf589bf-a3a7-4d53-a701-03e68ea1850b" />

**We can see all the meetings that the connected user has created and the invitations:**
<img width="1710" alt="Capture d’écran 2025-02-07 à 17 59 58" src="https://github.com/user-attachments/assets/2fde2326-9c33-434e-aff4-2a1760e7898e" />

**We can also see all rooms: create, edit and delete**
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 00 02" src="https://github.com/user-attachments/assets/63fb7859-2ba4-4d9f-b13b-9406a36ddf13" />

**User informations: update**
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 00 15" src="https://github.com/user-attachments/assets/5dfd7c58-a000-425d-823f-5f45b9b0780e" />

**Meeting Creation**
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 00 53" src="https://github.com/user-attachments/assets/70882397-038b-4de1-a91a-13a4008538a4" />
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 04 09" src="https://github.com/user-attachments/assets/e0c0b28e-6ec3-4b4e-8502-1f8b661c7c94" />

This method use Kafka and RabbitMQ.
- Kafka: to send a notification to each user (not implemented but a log is displayed)
<img width="1151" alt="Capture d’écran 2025-02-07 à 18 02 56" src="https://github.com/user-attachments/assets/ef0e90bd-6ff4-4f01-a0f6-cb6023f76a2e" />

- RabbitMQ: connexion with Room service and Auth service to get the user connected and tu check room availability.
If a room is already reserved at a given time, a message is displayed:
<img width="1710" alt="Capture d’écran 2025-02-07 à 18 34 35" src="https://github.com/user-attachments/assets/6a146264-e232-4fe3-8815-d7daa116bdf3" />

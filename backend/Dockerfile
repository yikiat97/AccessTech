FROM python:3.11.3
WORKDIR /backend
COPY parent/requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8080
COPY . .
CMD ["waitress-serve", "--listen=0.0.0.0:8080", "wsgi:app"]
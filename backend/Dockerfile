FROM python:3.11.3
WORKDIR /backend
COPY parent/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
EXPOSE 8080
COPY . .
CMD ["gunicorn", "wsgi:app", "-w 2", "-b 0.0.0.0:8080", "-t 30"]


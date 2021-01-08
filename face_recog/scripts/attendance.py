import datetime
from face_recognition import __MAIN__
import sys

date=str(datetime.date.today())
time=str(datetime.datetime.now())

time=list(map(int,time.split(' ')[1].split(':')[0:2]))
date=list(map(int,date.split('-')))

Total_Students=['Akella','Amardeep','Anurag','Ayush','Bhuvi','Gazal','Himanshu','Jai','Kavyansh','Kuldeep','Loveleen','Meenakshi','Prahlad','Pratik','Rajiv','Saanika','Sanchita','Sindhu','Vivek Pal']
Months=['January','February','March','April','May','June','July','August','September','October','November','December']
sub=['Math','Physics','Chemistry']
def sheet(Time):
    if Time==8:
        return 0           #'Math'
    elif Time==9:
        return 1           #'Physics'
    elif Time==10:
        return 2           #'Chemistry'

def update():
    Path_of_image= "public/uploads/" + sys.argv[1]
    # Path_of_image= sys.argv[1]
    Students=__MAIN__(Path_of_image) 
    subject=sheet(time[0])
    # Students = list(set(Students))
    # print(Students)
    ans = ""
    for x in Students:
        ans += x[1] + "-"
    print(ans) 
if __name__ == "__main__":
    update()
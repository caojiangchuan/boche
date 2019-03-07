package com.macxen.utils;

import java.math.BigDecimal;
/**  
* 提供精确的浮点数运算，包括加减乘除和四舍五入。
*/  
public class Arith{
    //默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;
    private Arith(){
    }
    /**
    * 提供精确的加法运算。
    * @param v1 被加数
    * @param v2 加数
    * @return 两个参数的和
    */
    public static double add(double v1,double v2){
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }
    public static BigDecimal add(BigDecimal v1, BigDecimal v2){
        v1 = v1 == null ? new BigDecimal(0) : v1;
        v2 = v2 == null ? new BigDecimal(0) : v2;
        return v1.add(v2);
    }
    /**
    * 提供精确的减法运算。
    * @param v1 被减数
    * @param v2 减数
    * @return 两个参数的差
    */
    public static double sub(double v1,double v2){
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }
    /**
     * 提供精确的减法运算。
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static BigDecimal sub(BigDecimal v1, BigDecimal v2){
        v1 = v1 == null ? new BigDecimal(0) : v1;
        v2 = v2 == null ? new BigDecimal(0) : v2;
        return v1.subtract(v2);
    }
    /**
    * 提供精确的乘法运算。
    * @param v1 被乘数
    * @param v2 乘数
    * @return 两个参数的积
    */
    public static double mul(double v1, double v2){
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 乘法运算
     * @param v1
     * @param v2
     * @return
     */
    public static BigDecimal mul(BigDecimal v1, BigDecimal v2) {
        v1 = v1 == null ? new BigDecimal(0) : v1;
        v2 = v2 == null ? new BigDecimal(0) : v2;
        return v1.multiply(v2);

    }


    /**
    * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
    * 小数点以后10位，以后的数字四舍五入。
    * @param v1 被除数
    * @param v2 除数
    * @return 两个参数的商
    */
    public static double div(double v1, double v2){
    return div(v1,v2,DEF_DIV_SCALE);
    }
    /**
    * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指定精度，以后的数字四舍五入。
    * @param v1 被除数
    * @param v2 除数
    * @param scale 表示表示需要精确到小数点以后几位。
    * @return 两个参数的商
    */
    public static double div(double v1, double v2, int scale){
        if(scale<0){
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指定精度，以后的数字四舍五入。
     * @param v1
     * @param v2
     * @param scale
     * @return
     */
    public static BigDecimal div(BigDecimal v1, BigDecimal v2, int scale) {
        v1 = v1 == null ? new BigDecimal(0) : v1;
        v2 = v2 == null ? new BigDecimal(0) : v2;
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        return v1.divide(v2, scale, BigDecimal.ROUND_HALF_UP);
    }
    /**
    * 提供精确的小数位四舍五入处理。
    * @param v 需要四舍五入的数字
    * @param scale 小数点后保留几位
    * @return 四舍五入后的结果
    */
    public static double round(double v, int scale){
        if(scale<0){
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        BigDecimal one = new BigDecimal("1");
        return b.divide(one,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供精确的小数位四舍五入处理。
     * @param v
     * @param scale
     * @return
     */
    public static BigDecimal round(BigDecimal v, int scale) {
        v = v == null ? new BigDecimal(0) : v;
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(v.toString());
        BigDecimal one = new BigDecimal("1");
        return b.divide(one, scale, BigDecimal.ROUND_HALF_UP);

    }
}
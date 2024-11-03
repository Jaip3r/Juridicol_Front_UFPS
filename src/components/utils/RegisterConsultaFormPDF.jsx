import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import LogoConsultorio from "../../assets/LogoConsultorio.jpeg";
import LogoUFPS2 from "../../assets/logo-ufps-2.png"

export const RegisterConsultaFormPDF = ({ formData }) => {

    // Definimos los estilos
    const styles = StyleSheet.create({
        body: {
            padding: 10, 
            fontSize: 10, 
            fontFamily: 'Helvetica',
            lineHeight: 1.2, 
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        logo_1: {
            width: 80,
            height: 80,
            marginHorizontal: 15,
        },
        logo_2: {
            width: 60,
            height: 60,
            marginHorizontal: 15,
        },
        headerTextContainer: {
            flexGrow: 1,
            alignItems: 'center',
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 5,
        },
        subtitle: {
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        section: {
            marginBottom: 10,
            padding: 8,
            borderWidth: 1,
            borderColor: '#aaa',
            borderRadius: 5
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 10,
            textDecoration: 'underline'
        },
        sectionTitleNoBorder: {
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 10,
            textDecoration: 'underline',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        fieldContainer: {
            flex: 1,
            marginHorizontal: 10,
        },
        fieldLabel: {
            fontWeight: 'bold',
            fontSize: 11,
            color: '#333'
        },
        fieldValue: {
            fontSize: 10,
            fontStyle: 'italic',
            color: '#555'
        },
        text: {
            marginBottom: 5,
            textAlign: 'justify'
        },
        commitmentsText: {
            fontSize: 9,
            marginBottom: 5,
            textAlign: 'justify',
            lineHeight: 1.2
        },
        signatureContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 10
        },
        signature: {
            width: '40%',
            textAlign: 'center',
            borderTop: '1 solid #000',
            paddingTop: 5
        }
    });

    return (
        <Document>

            <Page style={styles.body}>

                {/* Encabezado del formulario */}
                <View style={styles.header}>
                    <Image src={LogoConsultorio} style={styles.logo_1} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Recepción de consulta</Text>
                        <Text style={styles.subtitle}>CONSULTORIO JURÍDICO</Text>
                        <Text style={styles.subtitle}>UNIVERSIDAD FRANCISCO DE PAULA SANTANDER</Text>
                    </View>
                    <Image src={LogoUFPS2} style={styles.logo_2} />
                </View>

                {/* Datos Básicos del Solicitante */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos Básicos del Solicitante</Text>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nombres:</Text>
                            <Text style={styles.fieldValue}>{formData.nombre}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Apellidos:</Text>
                            <Text style={styles.fieldValue}>{formData.apellidos}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Género:</Text>
                            <Text style={styles.fieldValue}>{formData.genero}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Tipo de identificación:</Text>
                            <Text style={styles.fieldValue}>{formData.tipo_identificacion}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Número de identificación:</Text>
                            <Text style={styles.fieldValue}>{formData.numero_identificacion}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Fecha de nacimiento:</Text>
                            <Text style={styles.fieldValue}>{formData.fecha_nacimiento}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Número de contacto:</Text>
                            <Text style={styles.fieldValue}>{formData.numero_contacto}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Discapacidad:</Text>
                            <Text style={styles.fieldValue}>{formData.discapacidad}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Vulnerabilidad:</Text>
                            <Text style={styles.fieldValue}>{formData.vulnerabilidad}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Email:</Text>
                            <Text style={styles.fieldValue}>{formData.email || 'No presenta'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Lugar de nacimiento:</Text>
                            <Text style={styles.fieldValue}>{formData.lugar_nacimiento}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Ciudad:</Text>
                            <Text style={styles.fieldValue}>{formData.ciudad}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Dirección actual:</Text>
                            <Text style={styles.fieldValue}>{formData.direccion_actual}</Text>
                        </View>
                    </View>
                </View>

                {/* Caracterización Socioeconómica */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Caracterización Socioeconómica</Text>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nivel de estudio:</Text>
                            <Text style={styles.fieldValue}>{formData.nivel_estudio}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Estrato:</Text>
                            <Text style={styles.fieldValue}>{formData.estrato}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Sisben:</Text>
                            <Text style={styles.fieldValue}>{formData.sisben}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nivel de ingreso económico:</Text>
                            <Text style={styles.fieldValue}>{formData.nivel_ingreso_economico}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Actividad económica:</Text>
                            <Text style={styles.fieldValue}>{formData.actividad_economica}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Oficio:</Text>
                            <Text style={styles.fieldValue}>{formData.oficio}</Text>
                        </View>
                    </View>
                </View>

                {/* Datos Básicos de las Partes: Accionante */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos Básicos de las partes - Accionante</Text>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nombre del accionante:</Text>
                            <Text style={styles.fieldValue}>{formData.nombre_accionante}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Teléfono:</Text>
                            <Text style={styles.fieldValue}>{formData.telefono_accionante}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Correo:</Text>
                            <Text style={styles.fieldValue}>{formData.correo_accionante}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Dirección:</Text>
                            <Text style={styles.fieldValue}>{formData.direccion_accionante}</Text>
                        </View>
                    </View>
                </View>

                {/* Datos Básicos de las Partes: Accionado */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos Básicos de las partes - Accionado</Text>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nombre del accionado:</Text>
                            <Text style={styles.fieldValue}>{formData.nombre_accionado}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Teléfono:</Text>
                            <Text style={styles.fieldValue}>{formData.telefono_accionado || 'No presenta'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Correo:</Text>
                            <Text style={styles.fieldValue}>{formData.correo_accionado || 'No presenta'}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Dirección:</Text>
                            <Text style={styles.fieldValue}>{formData.direccion_accionado || 'No presenta'}</Text>
                        </View>
                    </View>
                </View>

                {/* Datos de la consulta */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos de la Consulta</Text>
                    {[{ label: "Hechos Relevantes", value: formData.hechosRelevantes },
                    { label: "Pretensiones", value: formData.pretensiones },
                    { label: "Observaciones", value: formData.observaciones }].map((item, index) => (
                        <Text style={styles.text} key={index}>
                            <Text style={{ fontWeight: 'bold' }}>{item.label}: </Text>
                            {item.value}
                        </Text>
                    ))}
                </View>

                {/* Anexos y caracterización de la consulta */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Anexos y caracterización de la consulta</Text>
                    <View style={styles.row}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Tipo de consulta:</Text>
                            <Text style={styles.fieldValue}>{formData.tipo_consulta}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Área del derecho:</Text>
                            <Text style={styles.fieldValue}>{formData.area_derecho}</Text>
                        </View>
                    </View>
                </View>

                {/* Compromisos Adquiridos */}
                <View>
                    <Text style={styles.sectionTitleNoBorder}>COMPROMISOS ADQUIRIDOS POR EL USUARIO AL SOLICITAR EL SERVICIO DE ASISTENCIA JURÍDICA AL CONSULTORIO JURÍDICO DE LA UNIVERSIDAD FRANCISCO DE PAULA SANTANDER</Text>
                    <Text style={styles.commitmentsText}>
                        Entre los suscritos, Aura Yulianeth Balaguera Rodríguez identificada con cédula de ciudadanía No. ______________ de Cúcuta,
                        quien en su condición de Directora General actúa en representación del Consultorio Jurídico de la Universidad
                        Francisco de Paula Santander, quien adelante se denominará EL CONSULTORIO, y ______________________________,
                        identificado(a) con cédula de ciudadanía No. ______________ de __________ quien en adelante se denominará
                        EL USUARIO, hemos decidido suscribir el siguiente compromiso respecto de la prestación del servicio de asistencia
                        jurídica: PRIMERA: EL USUARIO tendrá como deberes con el CONSULTORIO los siguientes:
                        1. Tratar con el debido respeto al personal que atiende su asunto.
                        2. Comprometerse con las obligaciones y el trámite judicial o administrativo que su asunto conlleve.
                        3. Relacionar en forma clara y precisa su dirección, correo electrónico y número telefónico donde se le pueda
                        contactar rápidamente, sea del lugar de residencia o trabajo.
                        4. Atender puntualmente las citas las citas y gestiones que demande la atención del asunto.
                        5. Colaborar diligentemente con la tramitación del asunto e informar de manera veraz y oportuna los datos necesarios
                        para la elaboración de la demanda o de cualquier tipo de memorial que lo requiera.
                        6. Entregar toda la información de la contraparte, ya sean datos personales, que se requiera para el adelantamiento de actuaciones.
                        7. Informar cualquier novedad o circunstancia que modifique o cambie el trámite judicial o administrativo. 
                        8. Aportar los documentos necesarios para el trámite de su proceso o asunto. 
                        9. Sufragar los gastos que demande la tramitación de su asunto. 
                        10. Dar cuenta de su situación económica cada vez que le sea solicitado, a fin de determinar si puede seguir disfrutando de los servicios del Consultorio.
                        SEGUNDA: La entrega de documentos solicitados o de la información requerida que habla la CLAUSULA
                        PRIMERA deberá ser resuelta por el usuario en el término de 5 días hábiles posteriores a su solicitud. De no ser atendido el requerimiento en el término establecido se
                        entenderá como falta de interés del USUARIO y se procederá con el archivo del asunto.
                        TERCERA: El USUARIO no tendrá que pagar suma alguna por la asesoría judicial o legal que le preste el CONSULTORIO, toda vez que es la prestación de un servicio gratuito, 
                        pero deberá correr por su cuenta y riesgo con los gastos causados con la actuación judicial o administrativa encomendada, tales como: 
                        1. Fotocopias de todos los documentos necesarios para adelantar el trámite respectivo. 
                        2. Cualquier publicación en radio o prensa. 
                        3. Pago de honorarios de los auxiliares de la justicia, tales como: peritos, avaluadores, curadores ad litem, etc. 
                        4. Gastos de notificación, condenas en costas y agencias en derecho, de derechos notariales, rentas y registro, así como de sanciones o multas anta la DIAN o Autoridades Administrativas o
                        Judiciales y cualquier otro gasto que sea necesario para el cabal desarrollo del trámite judicial. 
                        5. Los demás a los que haya lugar.
                        CUARTA: El USUARIO es el
                        responsable de la radicación ante las entidades respectivas de los memoriales, oficios y demás documentos que se realicen dentro de su asunto a su nombre. Debiendo
                        informar el radicado asignado o entregando copia del mismo para el seguimiento y gestión correspondiente, de haber lugar a la misma.
                        QUINTA: Queda establecido
                        por acuerdo de las partes, que si por cualquier razón imputable a negligencia, desidia o falta de interés, el USUARIO incumple cualquiera de los deberes establecidos en
                        la CLÁUSULA PRIMERA del presente compromiso, una vez sea verificada por el Consultorio Jurídico, se le comunicará mediante el medio más expedito la terminación
                        de su proceso, solicitud o consulta, de manera unilateral y anticipada. Para constancia se firma por las partes contratantes, en la ciudad de San José de Cúcuta, a los
                        _____ días del mes de ______________ de 2024. CONSULTORIO JURIDICO Aura Yulianath Balaguera Rodríguez Directora General del Consultorio Juridico de la
                        Universidad Francisco de Paula Santander USUARIO(A) Nombre: ______________________________ C.C No. ______________ 
                    </Text>
                </View>

                {/* Firmas */}
                <View style={styles.signatureContainer}>
                    <Text style={styles.signature}>Firma del Estudiante</Text>
                    <Text style={styles.signature}>Firma del Usuario</Text>
                </View>

            </Page>

        </Document>
    );

};